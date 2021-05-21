import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

export class Controller extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: false,
      elevatorName: null,
      targets: [],
      elevators: {
        elevatorA: {
          name: 'A',
          currentPosition: 0,
          goingFloor: null,
          direction: null,
          isMoving: false
        },
        elevatorB: {
          name: 'B',
          currentPosition: 6,
          goingFloor: null,
          direction: null,
          isMoving: false
        }
      }
    }
  }

  // decid which elevator goes to floor
  onClick = e => {
    const target = Number(e.target.value)
    const position1 = this.state.elevators.elevatorA.currentPosition
    const position2 = this.state.elevators.elevatorB.currentPosition

    if (this.state.elevators.elevatorA.isMoving && this.state.elevators.elevatorB.isMoving)
      this.setState({
        targets: [...this.state.targets, target]
      })
    else if (this.state.elevators.elevatorA.isMoving)
      this.callElevator(target, 'elevatorB')
    else if (this.state.elevators.elevatorB.isMoving)
      this.callElevator(target, 'elevatorA')
    else {
      if (Math.abs(position1 - target) < Math.abs(position2 - target))
        this.callElevator(target, 'elevatorA')
      else if (Math.abs(position1 - target) === Math.abs(position2 - target))
        if (position1 <= position2)
          this.callElevator(target, 'elevatorA')
        else
          this.callElevator(target, 'elevatorB')
      else
        this.callElevator(target, 'elevatorB')
    }
  }

  timer = (ms) => new Promise(res => setTimeout(res, ms))

  // set the called elevator properties
  callElevator = async (floor, elevator) => {
    const { currentPosition } = this.state.elevators[elevator]

    this.setState({
      ...this.state,
      elevators: {
        ...this.state.elevators,
        [elevator]: {
          ...this.state.elevators[elevator],
          direction: currentPosition <= floor ? 1 : 0,
          goingFloor: floor,
          isMoving: currentPosition === floor ? false : true
        }
      }
    })

    await this.timer(1000)
    this.moving(elevator)
  }

  // moving the elevator up or down
  moving = async elevator => {
    const { isMoving, goingFloor, direction } = this.state.elevators[elevator]

    if (isMoving) {
      while (this.state.elevators[elevator].currentPosition !== goingFloor) {
        let position = this.state.elevators[elevator].currentPosition
        if (direction)
          position++
        else
          position--

        this.setState({
          ...this.state,
          elevators: {
            ...this.state.elevators,
            [elevator]: {
              ...this.state.elevators[elevator],
              currentPosition: position
            }
          }
        })

        await this.timer(1000)
      }

      if (this.state.targets.length > 0) {
        this.callElevator(this.state.targets[0], elevator)
        const newTargets = [...this.state.targets]
        newTargets.splice(0, 1)

        this.setState({
          targets: newTargets
        })
      }
      else {
        this.setState({
          ...this.state,
          elevators: {
            ...this.state.elevators,
            [elevator]: {
              ...this.state.elevators[elevator],
              direction: null,
              goingFloor: null,
              isMoving: false
            }
          }
        })
      }
    }
  }

  // open and close reactstrap model
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  // set which elevator is occupied
  setElevator = e => {
    this.setState({
      elevatorName: e.target.value
    })
    this.toggle()
  }

  // select the wanted floor
  insideButton = e => {
    this.callElevator(Number(e.target.value), this.state.elevatorName)
    this.toggle()
  }

  render() {
    const array = [6, 5, 4, 3, 2, 1, 0]
    const { elevatorA, elevatorB } = this.state.elevators

    let firstButtonText = 'Stand'
    if (elevatorA.isMoving && elevatorA.direction === 1)
      firstButtonText = 'Moving up'
    else if (elevatorA.isMoving)
      firstButtonText = 'Moving down'

    let secondButtonText = 'Stand'
    if (elevatorB.isMoving && elevatorB.direction === 1)
      secondButtonText = 'Moving up'
    else if (elevatorB.isMoving)
      secondButtonText = 'Moving down'

    return (
      <div>
        <Container>
          {array.map((num) =>
            <Row key={num}>
              <Col sm={{ size: 2 }}>
                {firstButtonText}
              </Col>
              <Col sm={{ size: 1, offset: 1 }}>
                {num === elevatorA.currentPosition
                  ? <Button value='elevatorA' color='primary' onClick={e => this.setElevator(e)}>{firstButtonText}</Button>
                  : num}
              </Col>
              <Col sm={{ size: 2, offset: 1 }}>
                <Button value={num} onClick={e => this.onClick(e)}>up</Button>
                <Button value={num} onClick={e => this.onClick(e)}>down</Button>
              </Col>
              <Col sm={{ size: 1, offset: 1 }}>
                {num === elevatorB.currentPosition
                  ? <Button value='elevatorB' color='danger' onClick={e => this.setElevator(e)}>{secondButtonText}</Button>
                  : num}
              </Col>
              <Col sm={{ size: 2, offset: 1 }}>
                {secondButtonText}
              </Col>
            </Row>
          )}
        </Container>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>Elevator</ModalHeader>
          <ModalBody>
            {array.map((num) =>
              <Button key={num} color='warning' value={num} onClick={e => this.insideButton(e)}>{num}</Button>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default Controller
