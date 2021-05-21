# Elevator

This is a simple system which controls the elevator in a building. There are 7 floors in a block and only 2 lifts. Initially Lift A is at the ground floor and Lift B at the top floor.

# Functionalities

The whole functionalities are implemented in components/Controller.js

1. Whenever someone pres the up or down button on N th floor call the onClick method which decide which lift is the closest to that floor and "send" to pick him up. If both the lifts are at equidistant from the N th floor, then the lift from the lower floor comes up.
2. When press the blue or red but (which indicates the A and B elevator) appear a tab with numbers 0 to 6 pressing one of these the lift goes to the floor you want.
3. When "you are in the lift" you can press only one of the buttons, you can't change the slected floor while moving.
4. If both of lits are moving when you press up or down button on any floor the command was stored in targets field and when one of the elevators is done immediatly gose to saved floor
