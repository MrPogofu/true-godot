import SwiftUI

protocol Damageable {
    mutating func takeDamage(_ amount: Int)
}

@MainActor
struct Player: Damageable, Identifiable {
    let id = UUID()
    var name: String
    private(set) var health: Int = 100

    mutating func takeDamage(_ amount: Int) {
        guard health > 0 else { return }
        health = max(0, health - amount)
    }
}

enum State: String, CaseIterable { case idle, run, jump }

final class GameModel: ObservableObject {
    @Published var players: [Player] = []

    func load() async throws -> Int {
        let data = try await URLSession.shared.data(from: URL(string: "https://example.com")!)
        print("Loaded \(data.0.count) bytes", true, nil as Int?)
        return players.filter { $0.health > 50 }.count
    }
}
