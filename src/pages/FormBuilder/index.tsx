import { FormBuilderProvider } from "./contexts/FormBuilderContext"
import { FormBuilder } from "./components/FormBuilder"

export default function FormBuilderPage() {
  return (
    <div className="mx-auto p-4 w-full">
      <FormBuilderProvider>
        <FormBuilder />
      </FormBuilderProvider>
    </div>
  )
}
