module Main where

import qualified Data.Map as Map
import Data.Maybe (fromMaybe)

-- | A player record
data Player = Player
  { name   :: String
  , health :: Int
  } deriving (Show, Eq)

class Damageable a where
  damage :: Int -> a -> a

instance Damageable Player where
  damage n p = p { health = max 0 (health p - n) }

main :: IO ()
main = do
  let players = Map.fromList [(1, Player "Godette" 100)]
      p = fromMaybe (Player "?" 0) (Map.lookup 1 players)
  print $ damage 30 p
  mapM_ putStrLn ["done", show (health p > 50)]
