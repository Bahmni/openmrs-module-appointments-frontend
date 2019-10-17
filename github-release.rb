require "json"
require 'net/http'
require 'uri'

def readVersion
  file = File.open "./package.json"
  data = JSON.load file
  data['version']
end

def create_release(token, tag_name, username)
  uri = URI.parse("https://api.github.com/repos/#{username}/openmrs-module-appointment-frontend/releases")
  data = {"tag_name" => tag_name, "name" => tag_name}.to_json
  headers = {"Authorization" => "token #{token}", "Content-Type" => "application/json"}

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = Net::HTTP::Post.new(uri.request_uri, headers)
  request.body = data
  response = http.request(request)
  puts "Create Release Request Response Status #{response.code}"
  JSON.parse(response.body)['id']
end

def upload_asset(token, name, file, id, username)
  uri = URI.parse("https://uploads.github.com/repos/#{username}/openmrs-module-appointment-frontend/releases/#{id}/assets?name=#{name}")
  data = File.read(file)
  headers = {"Authorization" => "token #{token}", "Content-Type" => "application/octet-stream"}

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  request = Net::HTTP::Post.new(uri.request_uri, headers)
  request.body = data
  response = http.request(request)
  puts "Upload Asset Request Response Status #{response.code}"
end


def main
  if ARGV.length < 1
    puts "Usage: ruby github-release.rb <username>"
    exit
  end

  username = ARGV[0]
  token = ENV['GH_AUTH_TOKEN']
  version = readVersion
  name = "openmrs-module-appointment-frontend.zip"
  file = File.join(Dir.pwd, name)

  release_id = create_release(token, version, username)

  upload_asset(token,name, file, release_id, username)
end

main