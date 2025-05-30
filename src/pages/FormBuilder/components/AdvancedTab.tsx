import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdvancedTabProps {
  localSettings: any;
  handleChange: (field: string, value: any) => void;
}
function AdvancedTab({ localSettings, handleChange }: AdvancedTabProps) {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced form features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowSaveAsDraft">Allow Save as Draft</Label>
                  <p className="text-sm text-muted-foreground">Users can save their progress and continue later</p>
                </div>
                <Switch
                  id="allowSaveAsDraft"
                  checked={localSettings.allowSaveAsDraft}
                  onCheckedChange={(checked) => handleChange("allowSaveAsDraft", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessControl">Access Control</Label>
                <Select
                  value={localSettings.accessControl}
                  onValueChange={(value) => handleChange("accessControl", value)}
                >
                  <SelectTrigger id="accessControl">
                    <SelectValue placeholder="Select access control" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Anyone can access)</SelectItem>
                    <SelectItem value="authenticated">Authenticated Users Only</SelectItem>
                    <SelectItem value="restricted">Restricted (Specific roles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableVersioning">Enable Versioning</Label>
                  <p className="text-sm text-muted-foreground">Track and manage form versions</p>
                </div>
                <Switch
                  id="enableVersioning"
                  checked={localSettings.enableVersioning}
                  onCheckedChange={(checked) => handleChange("enableVersioning", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableChangeLogging">Enable Change Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all changes made to form submissions</p>
                </div>
                <Switch
                  id="enableChangeLogging"
                  checked={localSettings.enableChangeLogging}
                  onCheckedChange={(checked) => handleChange("enableChangeLogging", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableDataMapping">Enable Data Mapping</Label>
                  <p className="text-sm text-muted-foreground">Allow mapping imported data to form fields</p>
                </div>
                <Switch
                  id="enableDataMapping"
                  checked={localSettings.enableDataMapping}
                  onCheckedChange={(checked) => handleChange("enableDataMapping", checked)}
                />
              </div>
            </CardContent>
          </Card>
    )
}

export default AdvancedTab;