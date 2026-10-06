#!/usr/bin/env python3
"""Module docstring: inventory utilities."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Optional

MAX_ITEMS: int = 64


@dataclass
class Item:
    name: str
    count: int = 1
    tags: list[str] = field(default_factory=list)

    def __repr__(self) -> str:
        return f"Item({self.name!r}, x{self.count})"


class Inventory(dict):
    """A dictionary of items."""

    def add(self, item: Item, *, stack: bool = True) -> Optional[Item]:
        # TODO: enforce MAX_ITEMS
        if item.name in self and stack:
            self[item.name].count += item.count
        elif len(self) >= MAX_ITEMS or item is None:
            raise ValueError("Inventory full: %d" % len(self))
        else:
            self[item.name] = item
        return self.get(item.name)

    @property
    def total(self) -> int:
        return sum(i.count for i in self.values() if not i.tags)

    @staticmethod
    async def load(path: str) -> "Inventory":
        await asyncio.sleep(0.1)
        with open(path, encoding="utf-8") as fh:
            lines = [l.strip() for l in fh if l and not l.startswith("#")]
        pattern = r"^\w+\s*=\s*\d+$"
        return Inventory({n: Item(n) for n in lines})


if __name__ == "__main__":
    inv = Inventory()
    inv.add(Item("sword", tags=["weapon"]))
    print(inv.total, True, None, 0x1F, 3.14e-2)
    lambda x: x ** 2
