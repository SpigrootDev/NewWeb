// Account Management System
class AccountManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    loadUsers() {
        const users = JSON.parse(localStorage.getItem('petGameUsers') || '{}');
        return users;
    }

    saveUsers() {
        localStorage.setItem('petGameUsers', JSON.stringify(this.users));
    }

    register(username, password, petName, petType) {
        if (this.users[username]) {
            return { success: false, message: 'Benutzername bereits vergeben!' };
        }

        const petEmojis = {
            cat: '🐱', dog: '🐶', rabbit: '🐰', 
            hamster: '🐹', bird: '🐦'
        };

        this.users[username] = {
            password: password,
            petData: {
                name: petName,
                type: petType,
                emoji: petEmojis[petType],
                hunger: 100,
                happiness: 100,
                energy: 100,
                age: 0,
                isAlive: true,
                createdAt: Date.now(),
                lastUpdate: Date.now()
            }
        };

        this.saveUsers();
        return { success: true, message: 'Account erfolgreich erstellt!' };
    }

    login(username, password) {
        if (!this.users[username]) {
            return { success: false, message: 'Benutzername nicht gefunden!' };
        }

        if (this.users[username].password !== password) {
            return { success: false, message: 'Falsches Passwort!' };
        }

        this.currentUser = username;
        return { success: true, message: 'Erfolgreich angemeldet!' };
    }

    logout() {
        this.currentUser = null;
    }

    getCurrentPetData() {
        if (!this.currentUser) return null;
        return this.users[this.currentUser].petData;
    }

    savePetData(petData) {
        if (!this.currentUser) return;
        this.users[this.currentUser].petData = petData;
        this.saveUsers();
    }

    updateLastActivity() {
        if (!this.currentUser) return;
        this.users[this.currentUser].petData.lastUpdate = Date.now();
        this.saveUsers();
    }
}

// Enhanced Virtual Pet with Real-time Features
class VirtualPet {
    constructor(petData = null) {
        if (petData) {
            this.name = petData.name;
            this.type = petData.type;
            this.emoji = petData.emoji;
            this.hunger = petData.hunger;
            this.happiness = petData.happiness;
            this.energy = petData.energy;
            this.age = petData.age;
            this.isAlive = petData.isAlive;
            this.createdAt = petData.createdAt;
            this.lastUpdate = petData.lastUpdate;
            this.calculateRealTimeChanges();
        } else {
            this.name = "Miau";
            this.type = "cat";
            this.emoji = "🐱";
            this.hunger = 100;
            this.happiness = 100;
            this.energy = 100;
            this.age = 0;
            this.isAlive = true;
            this.createdAt = Date.now();
            this.lastUpdate = Date.now();
        }

        this.startGameLoop();
        this.updateDisplay();
    }

    calculateRealTimeChanges() {
        const now = Date.now();
        const timeDiff = now - this.lastUpdate;
        const minutesPassed = timeDiff / (1000 * 60);

        if (minutesPassed > 0) {
            const hungerDecay = minutesPassed * 2;
            const happinessDecay = minutesPassed * 1.5;
            const energyDecay = minutesPassed * 1;

            this.hunger = Math.max(0, this.hunger - hungerDecay);
            this.happiness = Math.max(0, this.happiness - happinessDecay);
            this.energy = Math.max(0, this.energy - energyDecay);

            const hoursPassed = timeDiff / (1000 * 60 * 60);
            this.age += hoursPassed;

            this.checkHealth();
            this.showReturnMessage(minutesPassed);
        }

        this.lastUpdate = now;
    }

    showReturnMessage(minutesPassed) {
        const hours = Math.floor(minutesPassed / 60);
        const minutes = Math.floor(minutesPassed % 60);

        let timeString = '';
        if (hours > 0) {
            timeString = `${hours} Stunden`;
            if (minutes > 0) timeString += ` und ${minutes} Minuten`;
        } else {
            timeString = `${minutes} Minuten`;
        }

        document.getElementById('lastVisit').textContent = 
            minutesPassed < 1 ? 'Gerade eben' : `vor ${timeString}`;

        if (minutesPassed > 30) {
            this.showMessage(`Du warst ${timeString} weg! Dein Haustier hat dich vermisst! 😢`, "sad");
        } else if (minutesPassed > 5) {
            this.showMessage(`Willkommen zurück! Du warst ${timeString} weg.`, "neutral");
        }
    }

    startGameLoop() {
        setInterval(() => {
            if (this.isAlive) {
                this.updateStats();
                this.updateDisplay();
                this.checkHealth();
                this.saveToAccount();
            }
        }, 5000);

        setInterval(() => {
            if (this.isAlive) {
                this.age += 1/60;
                this.updateDisplay();
            }
        }, 60000);
    }

    updateStats() {
        this.hunger = Math.max(0, this.hunger - (Math.random() * 0.5));
        this.happiness = Math.max(0, this.happiness - (Math.random() * 0.3));
        this.energy = Math.max(0, this.energy - (Math.random() * 0.2));
        this.lastUpdate = Date.now();
    }

    feed() {
        if (!this.isAlive) return;
        this.hunger = Math.min(100, this.hunger + 25);
        this.happiness = Math.min(100, this.happiness + 10);
        this.showMessage("Mmm, lecker! 🍖", "happy");
        this.saveToAccount();
    }

    play() {
        if (!this.isAlive) return;
        if (this.energy < 15) {
            this.showMessage("Zu müde zum Spielen! 😴", "sad");
            return;
        }
        this.happiness = Math.min(100, this.happiness + 30);
        this.energy = Math.max(0, this.energy - 15);
        this.hunger = Math.max(0, this.hunger - 5);
        this.showMessage("Spielen macht Spaß! 🎾", "happy");
        this.saveToAccount();
    }

    sleep() {
        if (!this.isAlive) return;
        this.energy = Math.min(100, this.energy + 35);
        this.happiness = Math.min(100, this.happiness + 5);
        this.showMessage("Gute Nacht! 😴💤", "happy");
        this.saveToAccount();
    }

    clean() {
        if (!this.isAlive) return;
        this.happiness = Math.min(100, this.happiness + 25);
        this.showMessage("Jetzt bin ich sauber! ✨", "happy");
        this.saveToAccount();
    }

    checkHealth() {
        if (this.hunger <= 0 || this.happiness <= 0 || this.energy <= 0) {
            this.isAlive = false;
            this.showGameOver();
            this.saveToAccount();
        }
    }

    getPetEmoji() {
        if (!this.isAlive) return "💀";

        if (this.hunger < 20 || this.happiness < 20 || this.energy < 20) {
            return this.type === 'cat' ? '😿' : 
                   this.type === 'dog' ? '🐕‍🦺' :
                   this.type === 'rabbit' ? '😰' :
                   this.type === 'hamster' ? '😵' : '🐦‍⬛';
        }
        if (this.hunger > 80 && this.happiness > 80 && this.energy > 80) {
            return this.type === 'cat' ? '😸' : 
                   this.type === 'dog' ? '🐕' :
                   this.type === 'rabbit' ? '🐰' :
                   this.type === 'hamster' ? '🐹' : '🐦';
        }
        return this.emoji;
    }

    getStatusMessage() {
        if (!this.isAlive) return "Tot 💀";

        if (this.hunger < 15) return "Ich habe großen Hunger! 🍖";
        if (this.happiness < 15) return "Mir ist sehr langweilig... 😔";
        if (this.energy < 15) return "Ich bin sehr müde... 😴";

        if (this.hunger < 30) return "Ich könnte etwas essen... 🍖";
        if (this.happiness < 30) return "Wollen wir spielen? 🎾";
        if (this.energy < 30) return "Ich bin ein wenig müde... 😴";

        if (this.hunger > 80 && this.happiness > 80 && this.energy > 80) {
            return "Ich bin super glücklich! 😸";
        }

        return "Mir geht es gut! 🐱";
    }

    getHealthStatus() {
        if (!this.isAlive) return "Tot";

        const avgStats = (this.hunger + this.happiness + this.energy) / 3;
        if (avgStats > 80) return "Ausgezeichnet";
        if (avgStats > 60) return "Gut";
        if (avgStats > 40) return "Okay";
        if (avgStats > 20) return "Schlecht";
        return "Kritisch";
    }

    getNextActionNeeded() {
        if (!this.isAlive) return "Neues Haustier erstellen";

        const stats = [
            { name: "Füttern", value: this.hunger, time: this.calculateTimeUntilCritical(this.hunger, 2) },
            { name: "Spielen", value: this.happiness, time: this.calculateTimeUntilCritical(this.happiness, 1.5) },
            { name: "Schlafen", value: this.energy, time: this.calculateTimeUntilCritical(this.energy, 1) }
        ];

        const mostUrgent = stats.reduce((min, stat) => 
            stat.time < min.time ? stat : min
        );

        if (mostUrgent.time < 5) return `Sofort ${mostUrgent.name}!`;
        if (mostUrgent.time < 15) return `In ${Math.round(mostUrgent.time)} Min. ${mostUrgent.name}`;
        if (mostUrgent.time < 60) return `In ${Math.round(mostUrgent.time)} Min. ${mostUrgent.name}`;
        return `In ${Math.round(mostUrgent.time/60)} Std. ${mostUrgent.name}`;
    }

    calculateTimeUntilCritical(currentValue, decayRate) {
        if (currentValue <= 0) return 0;
        return currentValue / decayRate;
    }

    showMessage(text, type = "neutral") {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = text;
        messageBox.className = `message message-${type}`;
    }

    showGameOver() {
        document.getElementById('gameOver').style.display = 'flex';
    }

    updateDisplay() {
        document.getElementById('petEmoji').textContent = this.getPetEmoji();
        document.getElementById('petName').textContent = this.name;
        document.getElementById('petStatus').textContent = this.getStatusMessage();

        const totalHours = Math.floor(this.age);
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        document.getElementById('ageDisplay').textContent = `${days} Tage, ${hours} Stunden`;

        document.getElementById('healthStatus').textContent = this.getHealthStatus();
        document.getElementById('nextAction').textContent = this.getNextActionNeeded();

        document.getElementById('statHunger').style.width = `${this.hunger}%`;
        document.getElementById('statHappiness').style.width = `${this.happiness}%`;
        document.getElementById('statEnergy').style.width = `${this.energy}%`;
    }

    saveToAccount() {
        if (typeof accountManager !== 'undefined') {
            accountManager.savePetData(this.getSaveData());
        }
    }

    getSaveData() {
        return {
            name: this.name,
            type: this.type,
            emoji: this.emoji,
            hunger: this.hunger,
            happiness: this.happiness,
            energy: this.energy,
            age: this.age,
            isAlive: this.isAlive,
            createdAt: this.createdAt,
            lastUpdate: this.lastUpdate
        };
    }

    revive() {
        if (this.isAlive) return false;

        this.hunger = 50;
        this.happiness = 50;
        this.energy = 50;
        this.isAlive = true;
        this.lastUpdate = Date.now();

        document.getElementById('gameOver').style.display = 'none';
        this.showMessage("Dein Haustier wurde wiederbelebt! 💖", "happy");
        this.saveToAccount();
        return true;
    }
}

let accountManager = new AccountManager();
let pet = null;

function startGame() {
    const petData = accountManager.getCurrentPetData();
    pet = new VirtualPet(petData);
}

document.getElementById('feedBtn').addEventListener('click', () => pet.feed());
document.getElementById('playBtn').addEventListener('click', () => pet.play());
document.getElementById('sleepBtn').addEventListener('click', () => pet.sleep());
document.getElementById('cleanBtn').addEventListener('click', () => pet.clean());
document.getElementById('reviveBtn').addEventListener('click', () => pet.revive());
