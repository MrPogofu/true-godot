# frozen_string_literal: true
require "json"

module Game
  class Player
    attr_reader :name, :health
    MAX_HEALTH = 100

    def initialize(name, health: MAX_HEALTH)
      @name = name
      @health = health
      @@count ||= 0
      @@count += 1
    end

    def take_damage!(amount)
      return :dead if @health <= 0
      @health -= amount
      yield self if block_given?
    end

    def to_s = "#{name} (#{health}/#{MAX_HEALTH})"
  end
end

players = %w[godette bob].map { |n| Game::Player.new(n.capitalize) }
players.each_with_index do |p, i|
  p.take_damage!(10 * i) { |pl| puts pl }
end
puts({ ok: true, value: nil }.to_json) unless players.empty?
pattern = /\A[a-z]+\z/i
