#!/bin/bash

read_version(){
  set -e;
  local version=$(cat package.json | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["version"]');
  echo $version
}

create_release() {
    local token="$1";
    local tag_name="$2";
    local commit_sha="$3";
    local repo_owner="$4";

    curl -s -S -X POST "https://api.github.com/repos/$repo_owner/openmrs-module-appointments-frontend/releases" \
	 -H "Authorization: token $token" \
	 -H "Content-Type: application/json" \
	 -d '{"tag_name": "'"$tag_name"'", "name" : "'"$tag_name"'", "target_commitish":"'"$commit_sha"'" }';
}

upload_asset() {
    set -e;

    local token="$1";
    local name="$2";
    local file="$3";
    local id="$4";
    local repo_owner="$5";

  curl -s -S -X POST "https://uploads.github.com/repos/$repo_owner/openmrs-module-appointments-frontend/releases/$id/assets?name=$name" \
	 -H "Accept: application/vnd.github.v3+json" \
	 -H "Authorization: token $token" \
	 -H "Content-Type: application/octet-stream" \
	 --data-binary @"$file";
}

main(){
  # Assign global variables to local variables
    local repo_owner=${args[0]}
    local token=$GH_AUTH_TOKEN;
    local name="openmrs-module-appointments-frontend.zip";
    local file="$(pwd)/$name";
    local release_name=$(read_version)
    local commit_sha=$(git rev-parse HEAD)

    local branchname=$(git rev-parse --abbrev-ref HEAD)
    if [ $branchname != "master" ]; then
      release_name="${branchname}-${release_name}"
    fi

    CREATE_RESPONSE=$(create_release "$token" "$release_name" "$commit_sha" "$repo_owner");
    local release_id=$(echo $CREATE_RESPONSE | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["id"]');
    echo "Created a release with id $release_id"
    echo "Created Response ******************************"
    echo $CREATE_RESPONSE

#    #Upload asset and save the output from curl
    UPLOAD_RESPONSE=$(upload_asset "$token" "$name" "$file" "$release_id" "$repo_owner");
    echo "Upload Response ******************************"
    echo "$UPLOAD_RESPONSE"
}
args=("$@")
main