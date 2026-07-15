import Phaser from 'phaser';

/**
 * Minimal playable prototype: move with WASD/arrows, an auto-firing
 * frost bolt targets the nearest enemy, enemies spawn at the edges
 * and chase you. Arctic palette placeholder graphics.
 *
 * This scene exists to prove the loop feels good — everything here
 * is disposable placeholder art.
 */
export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Image;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bolts!: Phaser.Physics.Arcade.Group;
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private kills = 0;
  private hud!: Phaser.GameObjects.Text;
  private alive = true;

  constructor() {
    super('game');
  }

  create(): void {
    this.kills = 0;
    this.alive = true;

    this.createTextures();
    this.drawSnowfield();

    this.player = this.physics.add.image(640, 360, 'player');
    this.player.setDepth(10);

    this.enemies = this.physics.add.group();
    this.bolts = this.physics.add.group();

    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as GameScene['keys'];
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.time.addEvent({ delay: 900, loop: true, callback: () => this.spawnEnemy() });
    this.time.addEvent({ delay: 500, loop: true, callback: () => this.fireBolt() });

    this.physics.add.overlap(this.bolts, this.enemies, (bolt, enemy) => {
      bolt.destroy();
      enemy.destroy();
      this.kills += 1;
    });

    this.physics.add.overlap(this.player, this.enemies, () => this.gameOver());

    this.hud = this.add
      .text(16, 12, '', { fontFamily: 'monospace', fontSize: '20px', color: '#bfe3ff' })
      .setDepth(20);
  }

  update(): void {
    if (!this.alive) return;

    const speed = 260;
    const left = this.keys.A.isDown || this.cursors.left.isDown;
    const right = this.keys.D.isDown || this.cursors.right.isDown;
    const up = this.keys.W.isDown || this.cursors.up.isDown;
    const down = this.keys.S.isDown || this.cursors.down.isDown;

    const v = new Phaser.Math.Vector2(
      (right ? 1 : 0) - (left ? 1 : 0),
      (down ? 1 : 0) - (up ? 1 : 0),
    )
      .normalize()
      .scale(speed);
    this.player.setVelocity(v.x, v.y);

    for (const enemy of this.enemies.getChildren() as Phaser.Physics.Arcade.Image[]) {
      this.physics.moveToObject(enemy, this.player, 90);
    }

    this.hud.setText(`kills ${this.kills}`);
  }

  private spawnEnemy(): void {
    if (!this.alive) return;
    const edge = Phaser.Math.Between(0, 3);
    const x = edge === 0 ? -20 : edge === 1 ? 1300 : Phaser.Math.Between(0, 1280);
    const y = edge === 2 ? -20 : edge === 3 ? 740 : Phaser.Math.Between(0, 720);
    this.enemies.create(x, y, 'enemy');
  }

  private fireBolt(): void {
    if (!this.alive) return;
    const target = this.nearestEnemy();
    if (!target) return;
    const bolt = this.bolts.create(this.player.x, this.player.y, 'bolt') as Phaser.Physics.Arcade.Image;
    this.physics.moveToObject(bolt, target, 480);
    this.time.delayedCall(2000, () => bolt.destroy());
  }

  private nearestEnemy(): Phaser.Physics.Arcade.Image | null {
    let best: Phaser.Physics.Arcade.Image | null = null;
    let bestDist = Infinity;
    for (const enemy of this.enemies.getChildren() as Phaser.Physics.Arcade.Image[]) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      if (d < bestDist) {
        bestDist = d;
        best = enemy;
      }
    }
    return best;
  }

  private gameOver(): void {
    this.alive = false;
    this.player.setVelocity(0, 0);
    this.physics.pause();
    this.add
      .text(640, 340, 'frozen.', { fontFamily: 'monospace', fontSize: '48px', color: '#e8f4ff' })
      .setOrigin(0.5)
      .setDepth(30);
    this.add
      .text(640, 400, 'press R to thaw', { fontFamily: 'monospace', fontSize: '20px', color: '#7fb2d9' })
      .setOrigin(0.5)
      .setDepth(30);
    this.input.keyboard!.once('keydown-R', () => {
      this.physics.resume();
      this.scene.restart();
    });
  }

  /** Placeholder textures drawn at runtime — no asset files needed yet. */
  private createTextures(): void {
    const g = this.make.graphics({ x: 0, y: 0 }, false);

    g.fillStyle(0xbfe3ff).fillCircle(12, 12, 12);
    g.generateTexture('player', 24, 24);
    g.clear();

    g.fillStyle(0x3b5a78).fillCircle(10, 10, 10);
    g.generateTexture('enemy', 20, 20);
    g.clear();

    g.fillStyle(0xe8f4ff).fillCircle(4, 4, 4);
    g.generateTexture('bolt', 8, 8);
    g.destroy();
  }

  private drawSnowfield(): void {
    const g = this.add.graphics().setDepth(0);
    for (let i = 0; i < 160; i++) {
      const x = Phaser.Math.Between(0, 1280);
      const y = Phaser.Math.Between(0, 720);
      g.fillStyle(0x18293c, Phaser.Math.FloatBetween(0.3, 1)).fillCircle(x, y, Phaser.Math.Between(1, 3));
    }
  }
}
