import * as React from "react";

import Blueprint from "./Blueprint";
import { renderPinTypeInformation, spacify } from "./TypeRenderer";

export default function FunctionRenderer(props: {
  subsystemName: string;
  func: any;
}) {
  let nextGuid = 0;
  function getGuid() {
    nextGuid++;
    return nextGuid.toString(16).padStart(32, "0").toUpperCase();
  }

  let subsystemNodeGuid = getGuid();
  let subsystemNodeName = "K2Node_GetSubsystem_1";

  let subsystemNodeOutPinGuid = getGuid();

  let intermediateVariableNodeGuid = getGuid();
  let intermediateVariableNodeName = "K2Node_VariableGet_2";

  let intermediateVariableInPinGuid = getGuid();
  let intermediateVariableOutPinGuid = getGuid();

  let functionNodeGuid = getGuid();
  let functionNodeName = "K2Node_CallFunction_8";

  let functionNodeExecPinGuid = getGuid();
  let functionNodeThenPinGuid = getGuid();

  let functionNodeInSubsystemPinGuid = getGuid();

  let targetSubsystemName = props.subsystemName;
  let functionTarget = `/Script/OnlineSubsystemBlueprints.Online${props.subsystemName}Subsystem`;
  if (props.subsystemName === "VoiceChatUser") {
    targetSubsystemName = "VoiceChat";
    functionTarget = "/Script/OnlineSubsystemBlueprints.VoiceChatUser";
  }

  let subsystemNode =
    `Begin Object Class=/Script/BlueprintGraph.K2Node_GetSubsystem Name="${subsystemNodeName}"
    CustomClass=Class'"/Script/OnlineSubsystemBlueprints.Online${targetSubsystemName}Subsystem"'
    NodePosX=0
    NodePosY=${props.func.Pure ? "25" : "54"}
    NodeGuid=${subsystemNodeGuid}
    CustomProperties Pin (PinId=${subsystemNodeOutPinGuid},PinName="ReturnValue",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"/Script/OnlineSubsystemBlueprints.Online${targetSubsystemName}Subsystem"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${
      props.subsystemName === "VoiceChatUser"
        ? intermediateVariableNodeName
        : functionNodeName
    } ${
      props.subsystemName === "VoiceChatUser"
        ? intermediateVariableInPinGuid
        : functionNodeInSubsystemPinGuid
    },),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
`.trim();

  let intermediateVariableNode = "";
  if (props.subsystemName === "VoiceChatUser") {
    intermediateVariableNode = `
Begin Object Class=/Script/BlueprintGraph.K2Node_VariableGet Name="${intermediateVariableNodeName}"
   VariableReference=(MemberParent=Class'"/Script/OnlineSubsystemBlueprints.OnlineVoiceChatSubsystem"',MemberName="PrimaryVoiceUser")
   SelfContextInfo=NotSelfContext
   NodePosX=0
   NodePosY=200
   NodeGuid=${intermediateVariableNodeGuid}

   CustomProperties Pin (PinId=${intermediateVariableOutPinGuid},PinName="PrimaryVoiceUser",PinFriendlyName="Primary Voice User",Direction="EGPD_Output",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"/Script/OnlineSubsystemBlueprints.VoiceChatUser"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${functionNodeName} ${functionNodeInSubsystemPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   
   CustomProperties Pin (PinId=${intermediateVariableInPinGuid},PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"/Script/OnlineSubsystemBlueprints.OnlineVoiceChatSubsystem"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${subsystemNodeName} ${subsystemNodeOutPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
End Object
`.trim();

    subsystemNodeName = intermediateVariableNodeName;
    subsystemNodeOutPinGuid = intermediateVariableOutPinGuid;
  }

  let inputPins = [];
  let outputPins = [];

  for (const parameter of props.func.Parameters) {
    if (parameter.Type.Out) {
      continue;
    }

    inputPins.push(
      `CustomProperties Pin (PinId=${getGuid()},PinName="${
        parameter.Identifier || ""
      }",PinToolTip="",${renderPinTypeInformation(
        parameter.Type
      )},PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)`
    );
  }

  if (props.func.ReturnType !== null) {
    outputPins.push(
      `CustomProperties Pin (PinId=${getGuid()},PinName="ReturnValue",PinToolTip="",Direction="EGPD_Output",${renderPinTypeInformation(
        props.func.ReturnType
      )},PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)`
    );
  }
  for (const parameter of props.func.Parameters) {
    if (!parameter.Type.Out) {
      continue;
    }

    let identifier = parameter.Identifier;
    if (identifier !== null && identifier.startsWith("Out")) {
      identifier = identifier.substring(3);
    }

    outputPins.push(
      `CustomProperties Pin (PinId=${getGuid()},PinName="${
        parameter.Identifier || ""
      }",PinToolTip="",Direction="EGPD_Output",${renderPinTypeInformation(
        parameter.Type
      )},PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)`
    );
  }

  let functionIdentifier = props.func.Identifier;
  if (
    functionIdentifier === "Initialize" ||
    functionIdentifier === "Uninitialize"
  ) {
    // We append an underscore to workaround a conflict with the USubsystem definition.
    functionIdentifier = `${functionIdentifier}_`;
  }

  let functionNode = "";
  if (props.func.Pure) {
    functionNode = `
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="${functionNodeName}"
   bIsPureFunc=True
   FunctionReference=(MemberParent=Class'"${functionTarget}"',MemberName="${functionIdentifier}")
   NodePosX=250
   NodePosY=0
   NodeGuid=${functionNodeGuid}

   CustomProperties Pin (PinId=${functionNodeInSubsystemPinGuid},PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\\nOnline ${
      props.subsystemName
    } Subsystem Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"${functionTarget}"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${subsystemNodeName} ${subsystemNodeOutPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   ${inputPins.join("\n")}
   ${outputPins.join("\n")}
End Object
`.trim();
  } else if (props.func.Async) {
    let asyncPins = [];
    for (const asyncPin of props.func.AsyncPins) {
      asyncPins.push(
        `CustomProperties Pin (PinId=${getGuid()},PinName="${asyncPin}",PinFriendlyName="${spacify(
          asyncPin
        )}",PinToolTip="${spacify(
          asyncPin
        )}",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)`
      );
    }

    functionNode = `
Begin Object Class=/Script/BlueprintGraph.K2Node_AsyncAction Name="${functionNodeName}"
   ProxyFactoryFunctionName="${props.func.Identifier}"
   ProxyFactoryClass=Class'"${functionTarget}${props.func.Identifier}"'
   ProxyClass=Class'"${functionTarget}${props.func.Identifier}"'
   NodePosX=250
   NodePosY=0
   NodeGuid=${functionNodeGuid}

   CustomProperties Pin (PinId=${functionNodeExecPinGuid},PinName="execute",PinToolTip="\\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   CustomProperties Pin (PinId=${functionNodeThenPinGuid},PinName="then",PinToolTip="\\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   CustomProperties Pin (PinId=${functionNodeInSubsystemPinGuid},PinName="Subsystem",PinToolTip="Target\\nOnline ${
      props.subsystemName
    } Subsystem Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"${functionTarget}"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${subsystemNodeName} ${subsystemNodeOutPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   ${asyncPins.join("\n")}

   ${inputPins.join("\n")}
   ${outputPins.join("\n")}
End Object
`.trim();
  } else {
    functionNode = `
Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="${functionNodeName}"
   FunctionReference=(MemberParent=Class'"${functionTarget}"',MemberName="${functionIdentifier}")
   NodePosX=250
   NodePosY=0
   NodeGuid=${functionNodeGuid}

   CustomProperties Pin (PinId=${functionNodeExecPinGuid},PinName="execute",PinToolTip="\\nExec",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
   CustomProperties Pin (PinId=${functionNodeThenPinGuid},PinName="then",PinToolTip="\\nExec",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   CustomProperties Pin (PinId=${functionNodeInSubsystemPinGuid},PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinToolTip="Target\\nOnline ${
      props.subsystemName
    } Subsystem Object Reference",PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"${functionTarget}"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(${subsystemNodeName} ${subsystemNodeOutPinGuid},),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)

   ${inputPins.join("\n")}
   ${outputPins.join("\n")}
End Object
`.trim();
  }
  return (
    <Blueprint
      blueprint={`${subsystemNode}
${intermediateVariableNode}
${functionNode}`}
      height="400px"
    />
  );
}
