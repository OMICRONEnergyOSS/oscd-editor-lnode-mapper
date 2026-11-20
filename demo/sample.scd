<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL"
     xmlns:sld="https://openscd.org/SCL/SSD/SLD/v0"
     version="2007" revision="C" release="5">
  <Header id="LNodeMapperDemo" uuid="f7c2291f-479b-4858-845f-f24f04cf38ff"/>
  <Substation name="Demo">
    <Private type="OpenSCD-SLD-Layout">
      <sld:SLDAttributes sld:w="13" sld:h="9"/>
    </Private>
    <VoltageLevel name="VL1">
      <Private type="OpenSCD-SLD-Layout">
        <sld:SLDAttributes sld:x="1" sld:y="1" sld:w="11" sld:h="7" sld:lx="1" sld:ly="1"/>
      </Private>
      <Bay name="Feeder">
        <Private type="OpenSCD-SLD-Layout">
          <sld:SLDAttributes sld:x="2" sld:y="2" sld:w="9" sld:h="5" sld:lx="2" sld:ly="2"/>
        </Private>
        <ConductingEquipment name="QA1" type="CBR">
          <Private type="OpenSCD-SLD-Layout">
            <sld:SLDAttributes sld:x="4" sld:y="4" sld:lx="4" sld:ly="5"/>
          </Private>
          <LNode iedName="None" lnClass="XCBR" lnInst="1" lnType="BreakerSpecification"/>
          <LNode iedName="FeederControl" ldInst="Control" lnClass="CSWI" lnInst="1" lnType="SwitchControl"/>
        </ConductingEquipment>
      </Bay>
    </VoltageLevel>
  </Substation>
  <IED name="FeederControl" manufacturer="Demo">
    <AccessPoint name="AP1">
      <Server>
        <Authentication/>
        <LDevice inst="Control">
          <LN0 lnClass="LLN0" inst="" lnType="DeviceRoot"/>
          <LN lnClass="CSWI" inst="1" lnType="SwitchControl"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <IED name="Switchgear" manufacturer="Demo">
    <AccessPoint name="AP1">
      <Server>
        <Authentication/>
        <LDevice inst="Breaker">
          <LN0 lnClass="LLN0" inst="" lnType="DeviceRoot"/>
          <LN lnClass="XCBR" inst="1" lnType="BreakerInstance"/>
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
  <DataTypeTemplates>
    <LNodeType id="DeviceRoot" lnClass="LLN0">
      <DO name="Beh" type="Behaviour"/>
    </LNodeType>
    <LNodeType id="SwitchControl" lnClass="CSWI">
      <DO name="Pos" type="Position"/>
    </LNodeType>
    <LNodeType id="BreakerSpecification" lnClass="XCBR">
      <DO name="Pos" type="Position"/>
      <DO name="OpCnt" type="OperationCount"/>
    </LNodeType>
    <LNodeType id="BreakerInstance" lnClass="XCBR">
      <DO name="Pos" type="Position"/>
    </LNodeType>
    <DOType id="Behaviour" cdc="ENS">
      <DA name="stVal" bType="Enum" type="BehaviourState" fc="ST"/>
    </DOType>
    <DOType id="Position" cdc="DPC">
      <DA name="stVal" bType="Dbpos" fc="ST"/>
    </DOType>
    <DOType id="OperationCount" cdc="INS">
      <DA name="stVal" bType="INT32" fc="ST"/>
    </DOType>
    <EnumType id="BehaviourState">
      <EnumVal ord="1">on</EnumVal>
      <EnumVal ord="5">off</EnumVal>
    </EnumType>
  </DataTypeTemplates>
</SCL>
