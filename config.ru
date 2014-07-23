require 'almanack/server'
require 'active_support/core_ext/time'
require 'active_support/core_ext/date'
require 'active_support/core_ext/date_time'
require 'active_support/core_ext/numeric/time'

Almanack.config do |c|
  c.title = "Event Calendar"
  c.theme = 'daves-theme'

  # Keeping it secret by hiding behind an evironment variable.
  # Grab yours from https://secure.meetup.com/meetup_api/key
  meetup_key = ENV['MEETUP_KEY']

  groups = %w(
    WellingtonPhotographyMeetupGroup
    WelliDotNet
    designpro
  )

  groups.each do |group|
    c.add_meetup_group group_urlname: group, key: '6766f4f04b451597026302b3e7f2a'
  end
end

run Almanack::Server
