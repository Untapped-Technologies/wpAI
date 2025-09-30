type StepperButtonType = {
  setCurrentStep: (val: number) => void
  currentStep: number
  arrLen: number
  handleSave: () => void
}

const StepperButtons = ({
  setCurrentStep,
  currentStep,
  arrLen,
  handleSave
}: StepperButtonType) => {
  const handleNext = () => {
    handleSave() // Actually call the function
    setCurrentStep(Math.min(currentStep + 1, arrLen - 1))
  }
  return (
    <div className="mt-4 flex gap-4 justify-end">
      <button
        onClick={() =>
          currentStep === 0
            ? null
            : setCurrentStep(Math.max(currentStep - 1, 0))
        }
        disabled={currentStep === 0}
        className={`px-4 py-2 rounded ${currentStep > 0 ? 'bg-[#254541] text-white hover:cursor-pointer' : 'disabled:opacity-50'}`}
      >
        Previous
      </button>

      {currentStep < arrLen - 1 ? (
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-[#254541] text-white rounded hover:cursor-pointer"
        >
          Next
        </button>
      ) : (
        <button
          onClick={() => console.log('Submit final confirmation')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Confirm & Finish
        </button>
      )}
    </div>
  )
}

export default StepperButtons
