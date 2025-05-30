import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SettingsTabProps {
  localSettings: any;
  handleChange: (field: string, value: any) => void;
}

function SettingsTab({ localSettings, handleChange }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Information</CardTitle>
        <CardDescription>Basic information about your form</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Form Name</Label>
          <Input
            id="name"
            value={localSettings.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter form name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Form Description</Label>
          <Textarea
            id="description"
            value={localSettings.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter form description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="redirectUrl">Redirect URL (Optional)</Label>
          <Input
            id="redirectUrl"
            value={localSettings.redirectUrl}
            onChange={(e) => handleChange("redirectUrl", e.target.value)}
            placeholder="https://example.com/thank-you"
          />
          <p className="text-xs text-muted-foreground">
            If provided, users will be redirected to this URL after form submission
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SettingsTab;