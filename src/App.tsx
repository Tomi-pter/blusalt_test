import { useState, useEffect } from "react";
import { Circle } from "lucide-react";
import styled from "styled-components";

type LightColor = "red" | "yellow" | "green";
type StreetState = {
  color: LightColor;
};
type TrafficLight = {
  color: LightColor;
  street?: string;
  direction: string;
};

const StreetsContainer = styled.div`
  width: 100dvw;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TrafficContainer = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.5fr;
  grid-template-rows: 2fr 1.5fr 2fr;

  p {
    justify-self: end;
    padding-right: 1rem;
    font-weight: bold;
  }
  p:nth-of-type(1) {
    grid-area: 1/1;
  }
  p:nth-of-type(2) {
    grid-area: 1/3;
    align-self: flex-end;
  }
`;

const ControlsContainer = styled.div`
  background-color: #2c2c2a;
  grid-area: 2/2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: -1px;

  button {
    padding: 0.5rem;
    width: 50%;
    color: white;
    background-color: green;
  }
`;

const TrafficLightStyle = styled.div<{ direction: string }>`
  background-color: #2c2c2a;
  width: ${(props) => (props.direction === "vertical" ? "200px" : "300px")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  section {
    display: flex;
    flex-direction: column;
    background-color: #ffbf38;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  &:nth-child(odd) {
    justify-self: center;
    height: 275px;
  }

  &:nth-child(1) {
    grid-area: 1/2;
  }
  &:nth-child(2) {
    grid-area: 2/1;
  }
  &:nth-child(3) {
    grid-area: 3/2;
  }
  &:nth-child(4) {
    grid-area: 2/3;
  }
`;

const TrafficLightSystem = () => {
  const [streetA, setStreetA] = useState<StreetState>({ color: "green" });
  const [streetB, setStreetB] = useState<StreetState>({ color: "red" });
  const [isRunning, setIsRunning] = useState(false);
  const [cycleStep, setCycleStep] = useState(0);

  const FULL_CYCLE = 10000;
  const HALF_CYCLE = 5000;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isRunning) {
      const updateCycle = () => {
        setCycleStep((prevStep) => {
          if (prevStep === 0 || prevStep === 2) {
            return prevStep + 1;
          } else if (prevStep === 1) {
            return 2;
          } else {
            return 0;
          }
        });
      };

      const runCycle = () => {
        const currentInterval = cycleStep % 2 === 0 ? FULL_CYCLE : HALF_CYCLE;
        timer = setTimeout(() => {
          updateCycle();
          runCycle();
        }, currentInterval);
      };

      runCycle();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, cycleStep]);

  useEffect(() => {
    switch (cycleStep) {
      case 0: // Street A: Green, Street B: Red (10 seconds)
        setStreetA({ color: "green" });
        setStreetB({ color: "red" });
        break;
      case 1: // Both Yellow (5 seconds)
        setStreetA({ color: "yellow" });
        setStreetB({ color: "yellow" });
        break;
      case 2: // Street A: Red, Street B: Green (10 seconds)
        setStreetA({ color: "red" });
        setStreetB({ color: "green" });
        break;
      case 3: // Both Yellow (5 seconds)
        setStreetA({ color: "yellow" });
        setStreetB({ color: "yellow" });
        break;
    }
  }, [cycleStep]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCycleStep(0);
    setStreetA({ color: "green" });
    setStreetB({ color: "red" });
  };

  const TrafficLight = ({ color, direction }: TrafficLight) => (
    <TrafficLightStyle direction={direction}>
      {/* <div>{street}</div> */}
      <section>
        <Circle
          fill={color === "red" ? "red" : "grey"}
          color={color === "red" ? "red" : "grey"}
          size={40}
        />
        <Circle
          fill={color === "yellow" ? "yellow" : "grey"}
          color={color === "yellow" ? "yellow" : "grey"}
          size={40}
        />
        <Circle
          fill={color === "green" ? "lime" : "grey"}
          color={color === "green" ? "lime" : "grey"}
          size={40}
        />
      </section>
    </TrafficLightStyle>
  );

  return (
    <StreetsContainer>
      <div>
        <h1>Traffic Light System</h1>
        <TrafficContainer>
          <p>Street A</p>
          <p>Street B</p>
          <TrafficLight
            color={streetA.color}
            street="Street A"
            direction="vertical"
          />
          <TrafficLight
            color={streetB.color}
            street="Street B"
            direction="horizontal"
          />
          <TrafficLight
            color={streetA.color}
            street="Street A"
            direction="vertical"
          />
          <TrafficLight
            color={streetB.color}
            street="Street B"
            direction="horizontal"
          />
          <ControlsContainer>
            <button onClick={handleStart} disabled={isRunning}>
              Start
            </button>
            <button onClick={handleReset}>Reset</button>
          </ControlsContainer>
        </TrafficContainer>
      </div>
    </StreetsContainer>
  );
};

export default TrafficLightSystem;
