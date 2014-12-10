require 'almanack/server'
require 'active_support/core_ext/time'
require 'active_support/core_ext/date'
require 'active_support/core_ext/date_time'
require 'active_support/core_ext/numeric/time'
require 'yaml'

meetup_api_key = ENV['MEETUP_API_KEY']

begin
  meetup_api_key ||= YAML.load_file('config.yml')['meetup_api_key']
rescue Errno::ENOENT
  abort "Did you create config.yml? See the README."
end

Almanack.config do |c|
  c.title = "Event Calendar"
  c.theme = 'bento'

  # Caching (empty the `tmp` directory to clear the cache)
  c.cache_responses = true
  c.cache_expiry = 900 # seconds

  groups = %w(
    WellingtonPhotographyMeetupGroup
    WelliDotNet
    designpro
  )

  groups.each do |group|
    c.add_meetup_group group_urlname: group, key: meetup_api_key
  end
end

run Almanack::Server
