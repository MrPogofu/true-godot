-- Player module
local Player = {}
Player.__index = Player

local MAX_HEALTH <const> = 100

function Player.new(name, health)
  local self = setmetatable({}, Player)
  self.name = name
  self.health = health or MAX_HEALTH
  return self
end

function Player:take_damage(amount)
  if self.health <= 0 then
    return false
  elseif amount > 50 then
    print(string.format("Critical hit on %s!", self.name))
  end
  self.health = math.max(0, self.health - amount)
  return true
end

--[[ Multi-line
     comment ]]
for i, p in ipairs({ Player.new("Godette"), Player.new("Bob", 50) }) do
  p:take_damage(i * 30)
  print(p.name, p.health, nil, true, 0x1F, #p.name)
end

return Player
