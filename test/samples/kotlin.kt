package game

import kotlinx.coroutines.*

data class Item(val name: String, var count: Int = 1)

sealed interface Event {
    object Start : Event
    data class Damage(val amount: Int) : Event
}

class Inventory : Iterable<Item> {
    private val items = mutableListOf<Item>()
    val size get() = items.size

    fun add(item: Item): Boolean = items.add(item)

    override fun iterator() = items.iterator()

    companion object {
        const val MAX = 64
    }
}

suspend fun main() = coroutineScope {
    val inv = Inventory().apply { add(Item("sword")) }
    val event: Event = Event.Damage(10)
    when (event) {
        is Event.Damage -> println("Ouch: ${event.amount}")
        Event.Start -> println("Go!")
    }
    launch { delay(100L); println("done ${inv.size}") }
    val nullable: String? = null
    println(nullable ?: "default", true, 0xFF, 1.5f)
}
