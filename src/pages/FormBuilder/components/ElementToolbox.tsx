import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ELEMENT_TYPES } from "@/pages/FormBuilder/data/ElementTypes";
import DraggableElement from "./DraggableElement";

function Toolbox() {
  const inputElements = ELEMENT_TYPES.filter((el) => el.category === "input");
  const layoutElements = ELEMENT_TYPES.filter((el) => el.category === "layout");
  const displayElements = ELEMENT_TYPES.filter(
    (el) => el.category === "display"
  );
  const advancedElements = ELEMENT_TYPES.filter(
    (el) => el.category === "advanced"
  );

  return (
    <div className="w-64 border-r p-4">
      <h3 className="font-medium mb-3">Form Elements</h3>
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-4">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Basic Inputs
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {inputElements.map((element) => (
                    <DraggableElement
                      key={element.type}
                      id={element.type}
                      label={element.label}
                      icon={element.icon}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Display
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayElements.map((element) => (
                    <DraggableElement
                      key={element.type}
                      id={element.type}
                      label={element.label}
                      icon={element.icon}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layout" className="mt-4">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Layout
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {layoutElements.map((element) => (
                    <DraggableElement
                      key={element.type}
                      id={element.type}
                      label={element.label}
                      icon={element.icon}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Advanced
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {advancedElements.map((element) => (
                    <DraggableElement
                      key={element.type}
                      id={element.type}
                      label={element.label}
                      icon={element.icon}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Toolbox;
