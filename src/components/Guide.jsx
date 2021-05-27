import { useState } from "react";
import { Button } from "@material-ui/core";
import Tour from "reactour";
const steps = [
  {
    selector: ".step-one",
    content: (
      <div>
        <h2>LedFx Guide</h2>
        Now we are able to create guides for you, to explain every little aspect
        of LedFx
      </div>
    ),
    style: {
      backgroundColor: "#303030",
    },
  },
  {
    selector: ".step-two",
    content: (
      <div>
        <h2>DAMN</h2>
        Still no guides yet :P
      </div>
    ),
    style: {
      backgroundColor: "#303030",
    },
  },
];
const Guide = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsTourOpen(true)} variant="outlined">
        Tour
      </Button>
      <Tour
        steps={steps}
        accentColor={"#0dbedc"}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </>
  );
};

export default Guide;
