import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

const steps = [
  "Kiểm duyệt thông tin",
  "kiểm duyệt xe",
  "Hợp đồng thuê xe",
];

export default function CustomStepper(props: any) {
  let {
    completed,
    activeStep,
    isCancelCar,
    contractGrId,
    parentCallback,
    isRent,
    isTranfer,
    isReceive,
  } = props;

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const isStepFailed = (step: number) => {
    return isCancelCar == true ? step === 1 : step === 0;
  };
  const handleStep = (step: number) => () => {
    parentCallback(step);
  };
  return (
    <Box className="mt-10 mb-12" sx={{ width: "100%" }}>
      {isCancelCar == true ||
      isCancelCar == false ||
      isRent == true ||
      isTranfer == true ||
      isReceive == true ? (
        <>
          <Stepper
            alternativeLabel
            activeStep={
              isCancelCar == true
                ? 1
                : isRent == true
                ? 2
                : isReceive == true
                ? 4
                : isTranfer == true
                ? 3
                : isCancelCar == false
                ? 0
                : 0
            }
          >
            {steps.map((label, index) => {
              const labelProps: {
                optional?: React.ReactNode;
                error?: boolean;
              } = {};
              if (isStepFailed(index)) {
                labelProps.optional = (
                  <Typography variant="caption" color="error">
                    Fail xe
                  </Typography>
                );
                labelProps.error = true;
              }

              return (
                <Step key={label}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </>
      ) : (
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step
              sx={{
                "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                  {
                    color: "rgb(28 25 23)", // Just text label (COMPLETED)
                    fontWeight: "600",
                  },
                "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                  {
                    color: "rgb(28 25 23)", // Just text label (COMPLETED)
                    fontWeight: "600",
                  },
              }}
              key={label}
              completed={completed[index]}
            >
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      )}
    </Box>
  );
}
