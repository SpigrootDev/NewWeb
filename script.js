class VirtualPet {
    constructor() {
        this.name = "Miau";
        this.hunger = 100;
        this.happiness = 100;
        this.energy = 100;
        this.age = 0;
        this.isAlive = true;
        this.lastUpdate = Date.now();
        
        this.startGameLoop();
        this.updateDisplay();
    }

    startGameLoop() {
        setInterval(() => {
            if (this.isAlive) {
                this.updateStats();
                this.updateDisplay();
                this.checkHealth();
            }
        }, 2000); // Update every 2 seconds

        // Age increase every 30 seconds
        setInterval(() => {
            if (this.isAlive) {
                this.age++;
            }
        }, 30000);
    }

    updateStats() {
        // Decrease stats over time
        this.hunger = Math.max(0, this.hunger - Math.random() * 3);
        this.happiness = Math.max(0, this.happiness - Math.random() * 2);
        this.energy = Math.max(0, this.energy - Math.random() * 1.5);
    }

    feed() {
        if (!this.isAlive) return;
        this.hunger = Math.min(100, this.hunger + 30);
        this.happiness = Math.min(100, this.happiness + 10);
        this.showMessage("Mmm, lecker! 🍖", "happy");
    }

    play() {
        if (!this.isAlive) return;
        if (this.energy < 20) {
            this.showMessage("Zu müde zum Spielen! 😴", "sad");
            return;
        }
        this.happiness = Math.min(100, this.happiness + 25);
        this.energy = Math.max(0, this.energy - 15);
        this.hunger = Math.max(0, this.hunger - 10);
        this.showMessage("Spielen macht Spaß! 🎾", "happy");
    }

    sleep() {
        if (!this.isAlive) return;
        this.energy = Math.min(100, this.energy + 40);
        this.happiness = Math.min(100, this.happiness + 5);
        this.showMessage("Gute Nacht! 😴💤", "happy");
    }

    clean() {
        if (!this.isAlive) return;
        this.happiness = Math.min(100, this.happiness + 20);
        this.showMessage("Jetzt bin ich sauber! ✨", "happy");
    }

    checkHealth() {
        if (this.hunger <= 0 || this.happiness <= 0 || this.energy <= 0) {
            this.isAlive = false;
            this.showGameOver();
        }
    }

    getPetEmoji() {
        if (!this.isAlive) return "💀";
        
        if (this.hunger < 30 || this.happiness < 30 || this.energy < 30) {
            return "😿"; // Sad cat
        }
        if (this.hunger > 70 && this.happiness > 70 && this.energy > 70) {
            return "😸"; // Happy cat
        }
        return "🐱"; // Normal cat
    }

    getStatusMessage() {
        if (!this.isAlive) return "Tot 💀";
        
        if (this.hunger < 20) return "Ich habe Hunger! 🍖";
        if (this.happiness < 20) return "Mir ist langweilig... 😔";
        if (this.energy < 20) return "Ich bin müde... 😴";
        
        if (this.hunger > 80 && this.happiness > 80 && this.energy > 80) {
            return "Ich bin super glücklich! 😸";
        }
        
        return "Alles ist okay! 🐱";
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
        // Update emoji and status
        document.getElementById('petEmoji').textContent = this.getPetEmoji();
        document.getElementById('petStatus').textContent = this.getStatusMessage();
        document.getElementById('ageDisplay').textContent = `${this.age} Tage`;

        // Update stat bars
        this.updateStatBar('hunger', this.hunger);
        this.updateStatBar('happiness', this.happiness);
        this.updateStatBar('energy', this.energy);

        // Add pulse effect for critical stats
        const petEmoji = document.getElementById('petEmoji');
        if (this.hunger < 30 || this.happiness < 30 || this.energy < 30) {
            petEmoji.classList.add('pulse');
        } else {
            petEmoji.classList.remove('pulse');
        }
    }

    updateStatBar(stat, value) {
        const bar = document.getElementById(`${stat}Bar`);
        const valueDisplay = document.getElementById(`${stat}Value`);
        
        bar.style.width = `${value}%`;
        valueDisplay.textContent = Math.round(value);
    }
}

// Global pet instance
let pet = new VirtualPet();

// Action functions
function feedPet() {
    pet.feed();
}

function playWithPet() {
    pet.play();
}

function petSleep() {
    pet.sleep();
}

function cleanPet() {
    pet.clean();
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    pet = new VirtualPet();
}