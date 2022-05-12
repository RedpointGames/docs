import * as React from "react";

import Blueprint from "./Blueprint";
import {
  getPinTypeInformation,
  renderPinTypeInformation,
  spacify,
} from "./TypeRenderer";

export default function EventRenderer(props: {
  subsystemName: string;
  event: any;
}) {
  let nextGuid = 0;
  function getGuid() {
    nextGuid++;
    return nextGuid.toString(16).padStart(32, "0").toUpperCase();
  }

  let subsystemNodeGuid = getGuid();
  let subsystemNodeName = "K2Node_GetSubsystem_1";

  let subsystemNodeOutPinGuid = getGuid();

  let bindingNodeGuid = getGuid();
  let bindingNodeName = "K2Node_AddDelegate_1";

  let bindingNodeExecPinGuid = getGuid();
  let bindingNodeThenPinGuid = getGuid();

  let bindingNodeInSubsystemPinGuid = getGuid();
  let bindingNodeInEventPinGuid = getGuid();

  let customEventNodeGuid = getGuid();
  let customEventNodeName = "K2Node_CustomEvent_0";

  let customEventNodeOutPinGuid = getGuid();

  let subsystemNode =
    `Begin Object Class=/Script/BlueprintGraph.K2Node_GetSubsystem Name="${subsystemNodeName}"
    CustomClass=Class'"/Script/OnlineSubsystemBlueprints.Online${props.subsystemName}Subsystem"'
    NodePosX=0
    NodePosY=54
    NodeGuid=${subsystemNodeGuid}
    CustomProperties Pin (PinId=${subsystemNodeOutPinGuid},PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"/Script/OnlineSubsystemBlueprints.Online${props.subsystemName}Subsystem"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${bindingNodeName} ${bindingNodeInSubsystemPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
`.trim();

  let bindingNode = `
Begin Object Class=/Script/BlueprintGraph.K2Node_AddDelegate Name="${bindingNodeName}"
   DelegateReference=(MemberParent=Class'"/Script/OnlineSubsystemBlueprints.Online${props.subsystemName}Subsystem"',MemberName="${props.event.Identifier}")
   NodePosX=250
   NodePosY=0
   NodeGuid=${bindingNodeGuid}

   CustomProperties Pin (PinId=${bindingNodeExecPinGuid},PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   CustomProperties Pin (PinId=${bindingNodeThenPinGuid},PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   CustomProperties Pin (PinId=${bindingNodeInSubsystemPinGuid},PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "BaseMCDelegateSelfPinName", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"/Script/OnlineSubsystemBlueprints.OnlineFriendsSubsystem"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${subsystemNodeName} ${subsystemNodeOutPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   CustomProperties Pin (PinId=${bindingNodeInEventPinGuid},PinName="Delegate",PinFriendlyName=NSLOCTEXT("K2Node", "PinFriendlyDelegatetName", "Event"),PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent=Package'"/Script/OnlineSubsystemBlueprints"',MemberName="Friends_FriendsChange_BP__DelegateSignature"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=True,PinType.bIsConst=True,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${customEventNodeName} ${customEventNodeOutPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
`.trim();

  let outputPins = [];

  for (const parameter of props.event.Parameters) {
    outputPins.push(
      `
CustomProperties Pin (PinId=${getGuid()},PinName="${
        parameter.Identifier || ""
      }",Direction="EGPD_Output",${renderPinTypeInformation(
        parameter.Type
      )},PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
CustomProperties UserDefinedPin (PinName="${
        parameter.Identifier || ""
      }",PinType=(PinCategory="${
        getPinTypeInformation(parameter.Type)["PinType.PinCategory"]
      }"),DesiredPinDirection=EGPD_Output)`.trim()
    );
  }

  let customEventNode = `
Begin Object Class=/Script/BlueprintGraph.K2Node_CustomEvent Name="${customEventNodeName}"
   CustomFunctionName="${spacify(props.event.Identifier)} Handler"
   NodePosX=0
   NodePosY=150
   NodeGuid=${customEventNodeGuid}

   CustomProperties Pin (PinId=${customEventNodeOutPinGuid},PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${bindingNodeName} ${bindingNodeInEventPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   CustomProperties Pin (PinId=${getGuid()},PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   ${outputPins.join("\n")}
End Object
`.trim();

  return (
    <Blueprint
      blueprint={`${subsystemNode}
${bindingNode}
${customEventNode}`}
      height="400px"
    />
  );
}
