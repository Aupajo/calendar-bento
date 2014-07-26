require 'almanack/server'
require 'active_support/core_ext/time'
require 'active_support/core_ext/date'
require 'active_support/core_ext/date_time'
require 'active_support/core_ext/numeric/time'
require 'yaml'

begin
  config = YAML.load_file('config.yml')
rescue Errno::ENOENT
  abort "Did you create config.yml? See the README."
end

Almanack.config do |c|
  c.title = "Event Calendar"
  c.theme = 'bento'

  groups = %w(
    WellingtonPhotographyMeetupGroup
    WelliDotNet
    designpro
  )

  groups.each do |group|
    c.add_meetup_group group_urlname: group, key: config["meetup_api_key"]
  end
end

run Almanack::Server
