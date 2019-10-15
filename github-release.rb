require "json"
require 'net/http'
require 'uri'

def readVersion
  file = File.open "./package.json"
  data = JSON.load file
  data['version']
end

def create_release(token, tag_name)
  uri = URI('https://api.github.com/repos/Bahmni/openmrs-module-appointment-frontend/releases')
  data = {"tag_name" => tag_name, "name" => tag_name}.to_json
  headers = {"Authorization" => "token #{token}", "Content-Type" => "application/json"}
  response = Net::HTTP.post(uri, data, headers)
  puts "Create Release Request Response Status #{response.code}"
  JSON.parse(response.body)['id']
end

def upload_asset(token, name, file, id)
  uri = URI("https://uploads.github.com/repos/Bahmni/openmrs-module-appointment-frontend/releases/#{id}/assets?name=#{name}")
  data = File.read(file)
  headers = {"Authorization" => "token #{token}", "Content-Type" => "application/octet-stream"}

  response = Net::HTTP.post(uri, data, headers)
  puts "Upload Asset Request Response Status #{response.code}"
end


def main
  token = ENV['GH_AUTH_TOKEN']
  version = readVersion
  name = "openmrs-module-appointment-frontend.zip"
  file = File.join(Dir.pwd, name)

  release_id = create_release(token, version)

  upload_asset(token,name, file, release_id)
end

main