import { CircleEllipsis, FileCheck2 } from 'lucide-react'
import StepperButtons from './_custom/stepper/stepperButtons'

type StepType = {
  id: number
  title: string
  status: string
  content: any
}

type DataType = {
  data: StepType[]
  currentStep: number
  setCurrentStep: (step: number) => void
  handleSave: (step: number) => void
}

const Stepper = ({
  data,
  currentStep,
  setCurrentStep,
  handleSave
}: DataType) => {
  return (
    <>
      <div className="flex items-start max-md:flex-col gap-y-6 gap-x-4 max-w-screen-lg mx-auto px-4 mt-8">
        {data.map((item, index) => {
          const colorSet =
            index < currentStep
              ? 'text-green-500'
              : index === currentStep
                ? 'text-[#bd5431]'
                : 'text-gray-300'
          const colorSetBG =
            index < currentStep
              ? 'bg-green-500'
              : index === currentStep
                ? 'bg-[#bd5431]'
                : 'bg-gray-300'
          return (
            <div className="w-full" key={item.id}>
              <div className={`w-full h-1 rounded-xl ${colorSetBG}`}></div>
              <div className="mt-2 mr-4 flex">
                {index < currentStep ? (
                  <FileCheck2 size={24} className="text-green-500" />
                ) : index === currentStep ? (
                  <CircleEllipsis size={24} className="text-[#bd5431]" />
                ) : (
                  <CircleEllipsis size={24} className="text-gray-300" />
                )}
                <div className="ml-2">
                  <h6 className={`text-sm font-semibold ${colorSet}`}>
                    {item.title}
                  </h6>
                  <p className={`text-xs font-medium ${colorSet}`}>
                    {index === currentStep
                      ? 'active'
                      : index < currentStep
                        ? 'completed'
                        : 'pending'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 w-full">
        {data[currentStep]?.content && (
          <div className="p-4 bg-white text-sm text-gray-700">
            {data[currentStep].content}
          </div>
        )}
      </div>

      <StepperButtons
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
        arrLen={data.length}
        handleSave={() => handleSave(currentStep)}
      />
    </>
  )
}

export default Stepper
