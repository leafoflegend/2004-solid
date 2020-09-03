const delay = (time: number): Promise<void> => new Promise((res) => {
  setTimeout(res, time);
});

// Doors, Floors, Power Supply
interface ElevatorDoor {
  open: () => Promise<boolean>;
  close: () => Promise<boolean>;
  checkDoorOpen: () => boolean;
}

class Door implements ElevatorDoor {
  private doorOpen: boolean = false;

  private DOOR_OPENING_LENGTH: number = 1000;

  public open = (): Promise<boolean> => new Promise((res, rej) => {
    if (this.doorOpen) rej(new Error('Door is already open.'));

    setTimeout(() => {
      this.doorOpen = true;

      res(true);
    }, this.DOOR_OPENING_LENGTH);
  });

  public close = (): Promise<boolean> => new Promise((res, rej) => {
    if (!this.doorOpen) rej(new Error('Door is already closed.'));

    setTimeout(() => {
      this.doorOpen = false;

      res(false);
    }, this.DOOR_OPENING_LENGTH);
  });

  public checkDoorOpen = () => this.doorOpen;
}

interface ElevatorFloors {
  goTo: (floor: number) => Promise<boolean>;
  checkCurrentFloor: () => number;
}

class Floors implements ElevatorFloors {
  private floorRange: { min: number, max: number, current: number };

  private powerSupply: ElevatorPowerSupply;

  private TIME_PER_FLOOR: number = 300;

  constructor(min: number, max: number, powerSupply: ElevatorPowerSupply) {
    this.floorRange = {
      min,
      max,
      current: 0,
    }

    this.powerSupply = powerSupply;
  }

  public checkCurrentFloor = () => this.floorRange.current;

  private checkIfFloorInBounds = (floor: number): boolean => {
    return !(floor < this.floorRange.min || floor > this.floorRange.max);
  }

  public goTo = (floor: number): Promise<boolean> => new Promise((res, rej) => {
    const isPowerRemaining = this.powerSupply.checkIfPowerRemaining(
      this.floorRange.current,
      floor,
    );

    if (!isPowerRemaining) rej(new Error(`Not enough power remaining to go to floor ${floor}.`));

    const isFloorInBounds = this.checkIfFloorInBounds(floor);

    if (!isFloorInBounds) rej(new Error(`Floor ${floor} does not exist in this elevator system.`));

    setTimeout(() => {
      this.floorRange.current = floor;
      res(true);
    }, Math.abs(this.floorRange.current - floor) * this.TIME_PER_FLOOR);
  });
}

interface ElevatorPowerSupply {
  checkIfPowerRemaining: (currentFloor: number, floor: number) => boolean;
  checkCurrentPower: () => number;
  goTo: (currentFloor: number, floor: number) => void;
}

class PowerSupply implements ElevatorPowerSupply {
  private COST_PER_FLOOR: number = 1;

  private RECHARGE_SPEED: number = 5000;

  private powerRemaining: number;

  constructor(startingPower: number) {
    this.powerRemaining = startingPower;

    setInterval(() => {
      ++this.powerRemaining;
    }, this.RECHARGE_SPEED);
  }

  public checkIfPowerRemaining = (currentFloor: number, floor: number): boolean => {
    const distance = Math.abs(currentFloor - floor);

    const cost = distance * this.COST_PER_FLOOR;

    return cost < this.powerRemaining;
  }

  public checkCurrentPower = () => this.powerRemaining;

  public goTo = (currentFloor: number, floor: number) => {
    const cost = Math.abs(currentFloor - floor) * this.COST_PER_FLOOR;

    this.powerRemaining -= cost;
  }
}

interface ElevatorImpl {
  checkCurrentFloor: () => number;
  goToFloor: (floor: number) => Promise<void>;
}

class Elevator implements ElevatorImpl {
  private floors: Floors;
  private doors: Door;

  constructor(
    startingPower: number,
    min: number,
    max: number,
  ) {
    const powerSupply = new PowerSupply(startingPower);
    const floors = new Floors(min, max, powerSupply);
    // TODO: Doors cost power too!
    const doors = new Door();

    this.floors = floors;
    this.doors = doors;
  }

  public checkCurrentFloor = () => this.floors.checkCurrentFloor();

  public goToFloor = async (floor: number) => {
    // TODO: Introduce a queueing system to plan the next floor.
    if (this.doors.checkDoorOpen()) throw new Error('Door is currently open, cannot change floors yet.');

    console.log('Going to floor: ', floor);
    await this.floors.goTo(floor);
    console.log('Arrived at floor: ', floor);

    // TODO: Would need to calculate the cost of power in advance for opening and closing, and ensure we could do this on top of the elevator move itself.
    console.log('Opening doors...');
    await this.doors.open();
    console.log('Doors opened.');

    await delay(2000);

    console.log('Doors closing...');
    await this.doors.close();
    console.log('Doors closed.');
  }
}

class QueueableElevator extends Elevator {
  // TODO: Build queueing class.
}

const elevator = new Elevator(100, 0, 25);

const start = async () => {
  console.log('Starting Floor: ', elevator.checkCurrentFloor());

  await elevator.goToFloor(13);

  console.log('Floor After Move 1: ', elevator.checkCurrentFloor());

  await elevator.goToFloor(20);

  console.log('Floor After Move 2: ', elevator.checkCurrentFloor());
}

start();
