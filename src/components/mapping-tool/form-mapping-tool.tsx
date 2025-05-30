"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, FileUp } from "lucide-react"
import { useState } from "react"
import { FormElement, useFormBuilder } from "./contexts/use-form-builder"

interface Mapping {
  sourceField: string;
  targetField: string;
  transform?: string;
}

export function FormMappingTool() {
  const { formState } = useFormBuilder()
  const [activeTab, setActiveTab] = useState("upload")
  const [mappingSource, setMappingSource] = useState<string>("mismo")
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [sampleData, setSampleData] = useState<Record<string, string | number | boolean | null> | null>(null)

  // Mock MISMO fields for demonstration
  const mismoFields = [
    "LOAN.LOAN_IDENTIFIER",
    "LOAN.NOTE.NOTE_RATE_PERCENT",
    "LOAN.NOTE.LOAN_AMOUNT",
    "BORROWER.NAME.FIRST_NAME",
    "BORROWER.NAME.LAST_NAME",
    "BORROWER.EMAIL_ADDRESS",
    "PROPERTY.ADDRESS.STREET_ADDRESS",
    "PROPERTY.ADDRESS.CITY",
    "PROPERTY.ADDRESS.STATE",
    "PROPERTY.ADDRESS.POSTAL_CODE",
    "PROPERTY.VALUATION.AMOUNT",
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real application, you would parse the file here
      // For this demo, we'll simulate loading sample data
      setSampleData({
        "LOAN.LOAN_IDENTIFIER": "123456789",
        "LOAN.NOTE.NOTE_RATE_PERCENT": "3.25",
        "LOAN.NOTE.LOAN_AMOUNT": "350000",
        "BORROWER.NAME.FIRST_NAME": "John",
        "BORROWER.NAME.LAST_NAME": "Doe",
        "BORROWER.EMAIL_ADDRESS": "john.doe@example.com",
        "PROPERTY.ADDRESS.STREET_ADDRESS": "123 Main St",
        "PROPERTY.ADDRESS.CITY": "Anytown",
        "PROPERTY.ADDRESS.STATE": "CA",
        "PROPERTY.ADDRESS.POSTAL_CODE": "12345",
        "PROPERTY.VALUATION.AMOUNT": "375000",
      })

      // Auto-generate mappings based on field names
      const newMappings = formState.elements
        .filter((element: FormElement) => element.properties.name)
        .map((element: FormElement) => {
          const fieldName = element.properties.name || ""
          // Try to find a matching MISMO field
          const matchingMismoField = mismoFields.find((mismoField) =>
            mismoField.toLowerCase().includes(fieldName.toLowerCase()),
          )

          return {
            sourceField: matchingMismoField || "",
            targetField: fieldName,
          }
        })
        .filter((mapping: Mapping) => mapping.sourceField)

      setMappings(newMappings)
      setActiveTab("mapping")
    }
  }

  const addMapping = () => {
    setMappings([...mappings, { sourceField: "", targetField: "" }])
  }

  const updateMapping = (index: number, field: string, value: string) => {
    const newMappings = [...mappings]
    newMappings[index] = { ...newMappings[index], [field]: value }
    setMappings(newMappings)
  }

  const removeMapping = (index: number) => {
    const newMappings = [...mappings]
    newMappings.splice(index, 1)
    setMappings(newMappings)
  }

  const saveMapping = () => {
    // In a real application, you would save the mapping configuration here
    alert("Mapping configuration saved successfully!")
  }

  const previewMapping = () => {
    if (!sampleData) return {}

    const result: Record<string, string | number | boolean | null> = {}

    mappings.forEach((mapping) => {
      if (mapping.sourceField && mapping.targetField) {
        result[mapping.targetField] = sampleData[mapping.sourceField]

        // Apply transformation if specified
        if (mapping.transform) {
          try {
            const transformFn = new Function("value", `return ${mapping.transform}`)
            result[mapping.targetField] = transformFn(result[mapping.targetField])
          } catch (error) {
            console.error("Error applying transformation:", error)
          }
        }
      }
    })

    return result
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Data Mapping Tool</h3>
        <Button onClick={saveMapping}>Save Mapping Configuration</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Data Source</CardTitle>
              <CardDescription>Upload a file or connect to a data source to map to your form fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mappingSource">Data Source Type</Label>
                <Select value={mappingSource} onValueChange={setMappingSource}>
                  <SelectTrigger id="mappingSource">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mismo">MISMO XML File</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="json">JSON File</SelectItem>
                    <SelectItem value="api">External API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mappingSource === "api" ? (
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input id="apiEndpoint" placeholder="https://api.example.com/data" />
                  <Button className="mt-2">Connect</Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                  <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop your {mappingSource.toUpperCase()} file here or click to browse
                  </p>
                  <Input id="fileUpload" type="file" className="hidden" onChange={handleFileUpload} />
                  <Button variant="outline" onClick={() => document.getElementById("fileUpload")?.click()}>
                    Browse Files
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>Map source data fields to form fields</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mappings.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        No mappings defined yet. Upload a data source or add mappings manually.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source Field</TableHead>
                          <TableHead className="w-[100px] text-center">
                            <ArrowRight className="mx-auto h-4 w-4" />
                          </TableHead>
                          <TableHead>Target Form Field</TableHead>
                          <TableHead>Transform (Optional)</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mappings.map((mapping, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Select
                                value={mapping.sourceField}
                                onValueChange={(value) => updateMapping(index, "sourceField", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mismoFields.map((field) => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-center">→</TableCell>
                            <TableCell>
                              <Select
                                value={mapping.targetField}
                                onValueChange={(value) => updateMapping(index, "targetField", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select form field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {formState.elements
                                    .filter((element) => element.properties.name)
                                    .map((element) => (
                                      <SelectItem key={element.id} value={element.properties.name || ""}>
                                        {element.label} ({element.properties.name})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="e.g. value.toUpperCase()"
                                value={mapping.transform || ""}
                                onChange={(e) => updateMapping(index, "transform", e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => removeMapping(index)}>
                                ×
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  <Button variant="outline" onClick={addMapping}>
                    Add Mapping
                  </Button>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapping Preview</CardTitle>
              <CardDescription>Preview how your data will be mapped to form fields</CardDescription>
            </CardHeader>
            <CardContent>
              {!sampleData ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Upload a data source to preview mapping results</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Source Data</h4>
                      <div className="border rounded-md p-4 max-h-[300px] overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(sampleData, null, 2)}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Mapped Form Data</h4>
                      <div className="border rounded-md p-4 max-h-[300px] overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(previewMapping(), null, 2)}</pre>
                      </div>
                    </div>
                  </div>

                  <Button>Apply Mapping to Form</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

