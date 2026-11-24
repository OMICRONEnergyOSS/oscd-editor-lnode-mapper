<?xml version="1.0" encoding="UTF-8"?><SCL xmlns="http://www.iec.ch/61850/2003/SCL" xmlns:eosld="https://openscd.org/SCL/SSD/SLD/v0" version="2007" revision="B" release="4">
	<Header id="2026_TopDownWorkshop"/>
	<Substation name="SS_TEMPLATE" desc="Substation">
		<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:w="20" eosld:h="25"/></Private><VoltageLevel name="VL_TEMPLATE" desc="Voltage Level" nomFreq="50" numPhases="3">
			<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="1" eosld:y="1" eosld:w="17" eosld:h="23" eosld:lx="0.5" eosld:ly="1"/></Private><Voltage unit="V" multiplier="k">110</Voltage>
			<Bay name="FB_TEMPLATE" desc="Q0x Feeder Bay">
				<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="2" eosld:y="5" eosld:w="15" eosld:h="18" eosld:lx="2" eosld:ly="5"/></Private><ConductingEquipment type="CBR" name="QA1" desc="Circuit Breaker">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="12" eosld:y="11" eosld:lx="13" eosld:ly="12"/></Private><Terminal name="T1" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L1" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L1"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="dab0ba74-eae7-4215-bcc7-46d4ce458c49"/></Private></Terminal>
					<Terminal name="T2" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L2" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L2"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="ec3a73ef-68e4-4ca8-bbdd-9c11222d8501"/></Private></Terminal>
					<EqFunction name="CircuitBreaker" desc="Circuit Breaker QA1">
						<LNode iedName="SPEC_SCU" lnClass="XCBR" lnInst="1" lnType="XCBR$oscd$_673c2a474503566e" ldInst="CircuitBreaker" prefix="">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="XCBR" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="CSWI$oscd$_54cf9e3523cd91ab">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="CILO$oscd$_aa7ec79ef27309b1">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CILO" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="PTRC" lnInst="1" lnType="PTRC$oscd$_17b7905e76314fb0">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="PTRC" sLnInst="1"/>
							</Private>
						</LNode>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment type="DIS" name="QB1" desc="Disconnector 1">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="10" eosld:y="9" eosld:lx="11" eosld:ly="10"/></Private><Terminal name="T2" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L1" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L1"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="71491a02-71f5-4efc-8bbe-61686c1c16b2"/></Private></Terminal>
					<EqFunction name="Disconnector1" desc="Disconnector QB1">
						<LNode iedName="SPEC_OLD" lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_1992b2cdb255e207" ldInst="Disconnector1" prefix="">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="XSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="CSWI$oscd$_d8b952184ecefe5c">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="CILO$oscd$_aa7ec79ef27309b1">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CILO" sLnInst="1"/>
							</Private>
						</LNode>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment type="DIS" name="QB2" desc="Disconnector 2">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="14" eosld:y="9" eosld:lx="15" eosld:ly="10"/></Private><Terminal name="T2" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L1" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L1"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="33bc4267-af92-4578-9aee-d875227bdf0a"/></Private></Terminal>
					<EqFunction name="Disconnector2" desc="Disconnector QB2">
						<LNode iedName="SPEC_SCU" lnClass="XSWI" lnInst="1" ldInst="Disconnector2" prefix="">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="XSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CSWI" lnInst="1" lnType="CSWI$oscd$_d8b952184ecefe5c">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="CILO$oscd$_aa7ec79ef27309b1">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CILO" sLnInst="1"/>
							</Private>
						</LNode>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment type="DIS" name="QC9" desc="Earth Switch">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="13" eosld:y="17" eosld:rot="3" eosld:lx="14.5" eosld:ly="18"/></Private><Terminal name="T1" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L3" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L3"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="9197376c-a3cb-4cfb-b46f-dd0b880013be"/></Private></Terminal>
					<Terminal name="T2" cNodeName="grounded" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/grounded"/>
					<EqFunction name="EarthSwitch" desc="EarthSwitch QC9">
						<LNode iedName="None" lnClass="XSWI" lnInst="1" lnType="XSWI$oscd$_1992b2cdb255e207">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="XSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="SPEC_BPCU" lnClass="CSWI" lnInst="1" lnType="CSWI$oscd$_d8b952184ecefe5c" ldInst="EarthSwitch" prefix="">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CSWI" sLnInst="1"/>
							</Private>
						</LNode>
						<LNode iedName="SPEC_BPCU" lnClass="CSWI" lnInst="1" lnType="CSWI$oscd$_d8b952184ecefe5c" ldInst="EarthSwitch" prefix="">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CSWI" sLnInst="2"/>
							</Private>
						</LNode>
						<LNode iedName="None" lnClass="CILO" lnInst="1" lnType="CILO$oscd$_aa7ec79ef27309b1">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="CILO" sLnInst="1"/>
							</Private>
						</LNode>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment type="CTR" name="T1" desc="Current Transformer">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="12" eosld:y="13" eosld:lx="13" eosld:ly="14"/></Private><Terminal name="T1" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L2" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L2"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="a2ad8fb7-058b-4c04-9789-d07e29592df0"/></Private></Terminal>
					<Terminal name="T2" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L3" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L3"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="51a44c4a-7d1c-429d-a7d8-0952f1259655"/></Private></Terminal>
					<EqFunction name="SMV_MU" desc="Merging Unit">
						<EqSubFunction name="I01A" desc="Current Phs 1">
							<LNode iedName="None" lnClass="TCTR" lnInst="1" lnType="TCTR$oscd$_13d021a7c679a823">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TCTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="I01B" desc="Current Phs 2">
							<LNode iedName="None" lnClass="TCTR" lnInst="2" lnType="TCTR$oscd$_13d021a7c679a823">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TCTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="I01C" desc="Current Phs 3">
							<LNode iedName="None" lnClass="TCTR" lnInst="3" lnType="TCTR$oscd$_13d021a7c679a823">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TCTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="I01N" desc="Current Res">
							<LNode iedName="None" lnClass="TCTR" lnInst="4" lnType="TCTR$oscd$_13d021a7c679a823">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TCTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="U01A" desc="Voltage Phs 1">
							<LNode iedName="None" lnClass="TVTR" lnInst="1" lnType="TVTR$oscd$_c360b0bdfa886120">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TVTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="U01B" desc="Voltage Phs 2">
							<LNode iedName="None" lnClass="TVTR" lnInst="2" lnType="TVTR$oscd$_c360b0bdfa886120">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TVTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="U01C" desc="Voltage Phs 3">
							<LNode iedName="None" lnClass="TVTR" lnInst="3" lnType="TVTR$oscd$_c360b0bdfa886120">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TVTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
						<EqSubFunction name="U01N" desc="Voltage Res">
							<LNode iedName="None" lnClass="TVTR" lnInst="4" lnType="TVTR$oscd$_c360b0bdfa886120">
								<Private type="eIEC61850-6-100">
									<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="TVTR" sLnInst="1"/>
								</Private>
							</LNode>
						</EqSubFunction>
					</EqFunction>
				</ConductingEquipment>
				<ConductingEquipment type="VTR" name="T9" desc="Voltage Transformer">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="13" eosld:y="15" eosld:rot="3" eosld:lx="14" eosld:ly="16"/></Private><Terminal name="T1" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L3" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L3"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="d68daaae-bebc-4f48-a62b-19a971b97b6f"/></Private></Terminal>
				</ConductingEquipment>
				<ConductingEquipment type="IFL" name="Line" desc="Infeed Line">
					<Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:x="12" eosld:y="20" eosld:lx="13" eosld:ly="21"/></Private><Terminal name="T1" connectivityNode="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L3" substationName="SS_TEMPLATE" voltageLevelName="VL_TEMPLATE" bayName="FB_TEMPLATE" cNodeName="L3"><Private type="OpenSCD-SLD-Layout"><eosld:SLDAttributes eosld:uuid="9ce0ac41-a09c-41b9-a375-7dbecfb2249c"/></Private></Terminal>
				</ConductingEquipment>
				<ConnectivityNode name="L1" pathName="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L1">
					<Private type="OpenSCD-SLD-Layout"><eosld:Section><eosld:Vertex eosld:x="10.5" eosld:y="9.84" eosld:uuid="71491a02-71f5-4efc-8bbe-61686c1c16b2"/><eosld:Vertex eosld:x="10.5" eosld:y="10.5"/><eosld:Vertex eosld:x="12.5" eosld:y="10.5"/></eosld:Section><eosld:Section><eosld:Vertex eosld:x="14.5" eosld:y="9.84" eosld:uuid="33bc4267-af92-4578-9aee-d875227bdf0a"/><eosld:Vertex eosld:x="14.5" eosld:y="10.5"/><eosld:Vertex eosld:x="12.5" eosld:y="10.5"/></eosld:Section><eosld:Section><eosld:Vertex eosld:x="12.5" eosld:y="10.5"/><eosld:Vertex eosld:x="12.5" eosld:y="11.16" eosld:uuid="dab0ba74-eae7-4215-bcc7-46d4ce458c49"/></eosld:Section></Private>
				</ConnectivityNode>
				<ConnectivityNode name="L2" pathName="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L2">
					<Private type="OpenSCD-SLD-Layout"><eosld:Section><eosld:Vertex eosld:x="12.5" eosld:y="11.84" eosld:uuid="ec3a73ef-68e4-4ca8-bbdd-9c11222d8501"/><eosld:Vertex eosld:x="12.5" eosld:y="13.16" eosld:uuid="a2ad8fb7-058b-4c04-9789-d07e29592df0"/></eosld:Section></Private>
				</ConnectivityNode>
				<ConnectivityNode name="L3" pathName="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/L3">
					<Private type="OpenSCD-SLD-Layout"><eosld:Section><eosld:Vertex eosld:x="12.5" eosld:y="13.84" eosld:uuid="51a44c4a-7d1c-429d-a7d8-0952f1259655"/><eosld:Vertex eosld:x="12.5" eosld:y="15.5"/></eosld:Section><eosld:Section><eosld:Vertex eosld:x="13.16" eosld:y="15.5" eosld:uuid="d68daaae-bebc-4f48-a62b-19a971b97b6f"/><eosld:Vertex eosld:x="12.5" eosld:y="15.5"/></eosld:Section><eosld:Section><eosld:Vertex eosld:x="12.5" eosld:y="15.5"/><eosld:Vertex eosld:x="12.5" eosld:y="17.5"/></eosld:Section><eosld:Section><eosld:Vertex eosld:x="13.16" eosld:y="17.5" eosld:uuid="9197376c-a3cb-4cfb-b46f-dd0b880013be"/><eosld:Vertex eosld:x="12.5" eosld:y="17.5"/></eosld:Section><eosld:Section><eosld:Vertex eosld:x="12.5" eosld:y="17.5"/><eosld:Vertex eosld:x="12.5" eosld:y="20.16" eosld:uuid="9ce0ac41-a09c-41b9-a375-7dbecfb2249c"/></eosld:Section></Private>
				</ConnectivityNode>
				<ConnectivityNode name="grounded" pathName="SS_TEMPLATE/VL_TEMPLATE/FB_TEMPLATE/grounded"/>
				<Function name="Application" desc="System Applications">
					<LNode iedName="None" lnClass="LPHD" lnInst="1" lnType="LPHD$oscd$_6e5b2f6b338c03da">
						<Private type="eIEC61850-6-100">
							<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="LPHD" sLnInst="1"/>
						</Private>
					</LNode>
				</Function>
				<Function name="System" desc="System Applications">
					<LNode iedName="None" lnClass="LPHD" lnInst="1" lnType="LPHD$oscd$_6e5b2f6b338c03da">
						<Private type="eIEC61850-6-100">
							<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="LPHD" sLnInst="1"/>
						</Private>
					</LNode>
				</Function>
				<Function name="Distance" desc="Distance Protection">
					<SubFunction name="Zone1_" desc="Distance Zone 1">
						<LNode iedName="None" lnClass="PDIS" lnInst="1" lnType="PDIS$oscd$_0adce19dbd0326c8">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="PDIS" sLnInst="1"/>
							</Private>
						</LNode>
					</SubFunction>
					<SubFunction name="Zone2_" desc="Distance Zone 2">
						<LNode iedName="None" lnClass="PDIS" lnInst="2" lnType="PDIS$oscd$_0adce19dbd0326c8">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="PDIS" sLnInst="1"/>
							</Private>
						</LNode>
					</SubFunction>
					<SubFunction name="Zone3_" desc="Distance Zone 3">
						<LNode iedName="None" lnClass="PDIS" lnInst="3" lnType="PDIS$oscd$_0adce19dbd0326c8">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="PDIS" sLnInst="1"/>
							</Private>
						</LNode>
					</SubFunction>
				</Function>
				<Function name="Measurement" desc="Digital Measurements">
					<SubFunction name="C_" desc="Current Measurement">
						<LNode iedName="None" lnClass="MMXU" lnInst="1" lnType="MMXU$oscd$_7c66df888d640e52">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="MMXU" sLnInst="1"/>
							</Private>
						</LNode>
					</SubFunction>
					<SubFunction name="V_" desc="Voltage Measurement">
						<LNode iedName="None" lnClass="MMXU" lnInst="1" lnType="MMXU$oscd$_476651844f81e32e">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="MMXU" sLnInst="1"/>
							</Private>
						</LNode>
					</SubFunction>
					<SubFunction name="P_" desc="Power Measurement">
						<LNode iedName="SPEC_BPCU" lnClass="MMXU" lnInst="1" lnType="MMXU$oscd$_5dd4c90771cf6cbc" ldInst="Measurement" prefix="C_">
							<Private type="eIEC61850-6-100">
								<eTr_6-100:LNodeSpecNaming xmlns:eTr_6-100="http://www.iec.ch/61850/2019/SCL/6-100" sIedName="None" sLnClass="MMXU" sLnInst="1"/>
							</Private>
						</LNode>
					</SubFunction>
				</Function>
			</Bay>
		</VoltageLevel>
	</Substation>
	<Communication>
		<SubNetwork name="Stationbus" desc="Station Bus" type="8-MMS">
			<BitRate unit="b/s" multiplier="M">100</BitRate>
			<ConnectedAP iedName="SPEC_BPCU" apName="AP1">
				<Address>
					<P type="IP">192.168.210.111</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
			</ConnectedAP>
			<ConnectedAP iedName="SPEC_MU" apName="F">
				<Address>
					<P type="IP">192.168.210.112</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
			</ConnectedAP>
			<ConnectedAP iedName="SPEC_SCU" apName="P1">
				<Address>
					<P type="IP">192.168.210.113</P>
					<P type="IP-SUBNET">255.255.255.0</P>
				</Address>
			</ConnectedAP>
		</SubNetwork>
	</Communication>
	<IED name="SPEC_BPCU" desc="Bay Protection and Control Unit" manufacturer="TBD">
		<Services nameLength="64">
			<DynAssociation max="5"/>
			<SettingGroups>
				<SGEdit/>
				<ConfSG/>
			</SettingGroups>
			<GetDirectory/>
			<GetDataObjectDefinition/>
			<DataObjectDirectory/>
			<GetDataSetValue/>
			<DataSetDirectory/>
			<ConfDataSet max="27" maxAttributes="80"/>
			<ReadWrite/>
			<ConfReportControl max="105" bufMode="both" bufConf="true"/>
			<GetCBValues/>
			<ReportSettings cbName="Conf" datSet="Conf" rptID="Dyn" optFields="Dyn" bufTime="Dyn" trgOps="Dyn" intgPd="Dyn"/>
			<GSESettings cbName="Conf" datSet="Conf" appID="Conf"/>
			<SMVSettings cbName="Conf" svID="Conf" optFields="Conf">
				<SmpRate>80</SmpRate>
			</SMVSettings>
			<GOOSE max="6"/>
			<FileHandling ftp="true" ftps="true"/>
			<ConfLNs fixPrefix="true" fixLnInst="true"/>
			<ClientServices goose="true" sv="true" supportsLdName="true" maxGOOSE="50" maxSMV="4">
				<TimeSyncProt/>
				<McSecurity/>
			</ClientServices>
			<RedProt hsr="true" prp="true"/>
			<CommProt/>
			<SMVsc max="1"/>
			<ConfLdName/>
		</Services>
		<AccessPoint name="AP1">
			<Server>
				<Authentication/>
				<LDevice inst="Application">
					<LN0 lnClass="LLN0" inst="" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="LPHD" inst="1" desc="Physical Device BPCU" lnType="LPHD$oscd$_6e5b2f6b338c03da"/>
					<LN lnClass="LTMS" lnType="LTMS$oscd$_1d817d709be9cda3" inst="1" desc="Supervision PTP"/>
					<LN lnClass="LCCH" lnType="LCCH$oscd$_e84838c16d9bc836" inst="1" prefix="SB_" desc="Supervision Stationbus"/>
					<LN lnClass="LCCH" lnType="LCCH$oscd$_e84838c16d9bc836" inst="1" prefix="PB_" desc="Supervision Processbus"/>
					<LN lnClass="LSVS" lnType="LSVS$oscd$_6553bf2c482cbdab" inst="1" desc="Supervision SV"/>
				</LDevice>
				<LDevice inst="CircuitBreaker">
					<LN0 lnClass="LLN0" inst="" desc="QA1 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="CSWI" inst="1" desc="QA1 Control" lnType="CSWI$oscd$_54cf9e3523cd91ab"/>
					<LN prefix="" lnClass="CILO" inst="1" desc="QA1 Interlocking" lnType="CILO$oscd$_aa7ec79ef27309b1"/>
					<LN prefix="" lnClass="PTRC" inst="1" desc="QA1 Trip Logic" lnType="PTRC$oscd$_17b7905e76314fb0"/>
				</LDevice>
				<LDevice inst="Disconnector1">
					<LN0 lnClass="LLN0" inst="" desc="QB1 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="CSWI" inst="1" desc="QB1 Control" lnType="CSWI$oscd$_d8b952184ecefe5c"/>
					<LN prefix="" lnClass="CILO" inst="1" desc="QB1 Interlocking" lnType="CILO$oscd$_aa7ec79ef27309b1"/>
				</LDevice>
				<LDevice inst="Disconnector2">
					<LN0 lnClass="LLN0" inst="" desc="QB2 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="CSWI" inst="1" desc="QB2 Control" lnType="CSWI$oscd$_d8b952184ecefe5c"/>
					<LN prefix="" lnClass="CILO" inst="1" desc="QB2 Interlocking" lnType="CILO$oscd$_aa7ec79ef27309b1"/>
				</LDevice>
				<LDevice inst="EarthSwitch">
					<LN0 lnClass="LLN0" inst="" desc="QC9 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="CSWI" inst="1" desc="QC9 Control" lnType="CSWI$oscd$_d8b952184ecefe5c"/>
					<LN prefix="" lnClass="CILO" inst="1" desc="QC9 Interlocking" lnType="CILO$oscd$_aa7ec79ef27309b1"/>
				</LDevice>
				<LDevice inst="Distance">
					<LN0 lnClass="LLN0" inst="" desc="Distance LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="Zone1_" lnClass="PDIS" inst="1" desc="Distance Zone 1" lnType="PDIS$oscd$_0adce19dbd0326c8"/>
					<LN prefix="Zone2_" lnClass="PDIS" inst="2" desc="Distance Zone 2" lnType="PDIS$oscd$_0adce19dbd0326c8"/>
					<LN prefix="Zone3_" lnClass="PDIS" inst="3" desc="Distance Zone 3" lnType="PDIS$oscd$_0adce19dbd0326c8"/>
				</LDevice>
				<LDevice inst="Measurement">
					<LN0 lnClass="LLN0" inst="" desc="Measurement LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="C_" lnClass="MMXU" inst="1" desc="C Measurements" lnType="MMXU$oscd$_7c66df888d640e52"/>
					<LN prefix="V_" lnClass="MMXU" inst="1" desc="V Measurements" lnType="MMXU$oscd$_476651844f81e32e"/>
					<LN prefix="P_" lnClass="MMXU" inst="1" desc="P Measurements" lnType="MMXU$oscd$_5dd4c90771cf6cbc"/>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<IED name="SPEC_MU" desc="Merging Unit" manufacturer="TBD">
		<AccessPoint name="F">
			<Server>
				<Authentication/>
				<LDevice inst="System">
					<LN0 lnClass="LLN0" desc="System LLN0" inst="" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="LPHD" inst="1" desc="Physical Device MU" lnType="LPHD$oscd$_6e5b2f6b338c03da"/>
					<LN lnClass="LTMS" lnType="LTMS$oscd$_1d817d709be9cda3" inst="1" desc="Supervision PTP"/>
					<LN lnClass="LCCH" lnType="LCCH$oscd$_e84838c16d9bc836" inst="1" prefix="PB_" desc="Supervision Processbus"/>
				</LDevice>
				<LDevice inst="SMV_MU">
					<LN0 lnClass="LLN0" inst="" desc="Merging Unit LLN0" lnType="LLN0$oscd$_4fd94df3c07db4cd"/>
					<LN prefix="I01A" lnClass="TCTR" inst="1" desc="MU CT 1" lnType="TCTR$oscd$_13d021a7c679a823"/>
					<LN prefix="I01B" lnClass="TCTR" inst="2" desc="MU CT 2" lnType="TCTR$oscd$_13d021a7c679a823"/>
					<LN prefix="I01C" lnClass="TCTR" inst="3" desc="MU CT 3" lnType="TCTR$oscd$_13d021a7c679a823"/>
					<LN prefix="I01N" lnClass="TCTR" inst="4" desc="MU CT 4" lnType="TCTR$oscd$_13d021a7c679a823"/>
					<LN prefix="U01A" lnClass="TVTR" inst="1" desc="MU VT 1" lnType="TVTR$oscd$_c360b0bdfa886120"/>
					<LN prefix="U01B" lnClass="TVTR" inst="2" desc="MU VT 2" lnType="TVTR$oscd$_c360b0bdfa886120"/>
					<LN prefix="U01C" lnClass="TVTR" inst="3" desc="MU VT 3" lnType="TVTR$oscd$_c360b0bdfa886120"/>
					<LN prefix="U01N" lnClass="TVTR" inst="4" desc="MU VT 4" lnType="TVTR$oscd$_c360b0bdfa886120"/>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<IED name="SPEC_SCU" desc="Switch Control Unit" manufacturer="TBD">
		<AccessPoint name="P1">
			<Server>
				<Authentication/>
				<LDevice inst="CircuitBreaker">
					<LN0 lnClass="LLN0" inst="" desc="QA1 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="LPHD" inst="1" desc="Physical Device SCU" lnType="LPHD€05451ee3-64c4-4d70-8157-1c1cdf97ce70"/>
					<LN prefix="" lnClass="XCBR" inst="1" desc="QA1 Status" lnType="XCBR$oscd$_673c2a474503566e"/>
				</LDevice>
				<LDevice inst="Disconnector1">
					<LN0 lnClass="LLN0" inst="" desc="QB1 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="XSWI" inst="1" desc="QB1 Status" lnType="XSWI$oscd$_1992b2cdb255e207"/>
				</LDevice>
				<LDevice inst="Disconnector2">
					<LN0 lnClass="LLN0" inst="" desc="QB2 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="XSWI" inst="1" desc="QB2 Status" lnType="XSWI$oscd$_1992b2cdb255e207"/>
				</LDevice>
				<LDevice inst="EarthSwitch">
					<LN0 lnClass="LLN0" inst="" desc="QC9 LLN0" lnType="LLN0$oscd$_8b96aca9de4326dc"/>
					<LN prefix="" lnClass="XSWI" inst="1" desc="QC9 Status" lnType="XSWI$oscd$_1992b2cdb255e207"/>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType lnClass="PTRC" desc="Trip Conditioning" id="PTRC$oscd$_17b7905e76314fb0">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Op" type="Op$oscd$_8598a343000a4c8c" transient="true"/>
			<DO name="Tr" type="Tr$oscd$_8598a343000a4c8c"/>
			<DO name="Str" type="Str$oscd$_ba49448ecb46113a"/>
		</LNodeType>
		<LNodeType lnClass="XCBR" desc="Circuit Breaker" id="XCBR$oscd$_673c2a474503566e">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="BlkCls" type="BlkCls$oscd$_2ae8d6d3877c6ea9"/>
			<DO name="BlkOpn" type="BlkOpn$oscd$_2ae8d6d3877c6ea9"/>
			<DO name="Loc" type="Loc$oscd$_d915d66d9e42a575"/>
			<DO name="OpCnt" type="OpCnt$oscd$_bbaa9369107884bc"/>
			<DO name="Pos" type="Pos$oscd$_fb08409822e126d6"/>
			<DO name="NamPlt" type="NamPlt$oscd$_bd4953f6c36ae1cf"/>
		</LNodeType>
		<LNodeType lnClass="XSWI" desc="Disconnector" id="XSWI$oscd$_1992b2cdb255e207">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="BlkCls" type="BlkCls$oscd$_2ae8d6d3877c6ea9"/>
			<DO name="BlkOpn" type="BlkOpn$oscd$_2ae8d6d3877c6ea9"/>
			<DO name="Loc" type="Loc$oscd$_d915d66d9e42a575"/>
			<DO name="OpCnt" type="OpCnt$oscd$_bbaa9369107884bc"/>
			<DO name="Pos" type="Pos$oscd$_fb08409822e126d6"/>
			<DO name="SwTyp" type="SwTyp$oscd$_febe33b013272c11"/>
			<DO name="NamPlt" type="NamPlt$oscd$_bd4953f6c36ae1cf"/>
		</LNodeType>
		<LNodeType lnClass="CSWI" desc="Control Switch CB" id="CSWI$oscd$_54cf9e3523cd91ab">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Pos" type="Pos$oscd$_66251974e451c6bd"/>
			<DO name="CBSwitchOff" type="CBSwitchOff$oscd$_bdbbd544abbc1e96"/>
			<DO name="OpCls" type="OpCls$oscd$_8598a343000a4c8c" transient="true"/>
		</LNodeType>
		<LNodeType lnClass="CSWI" desc="Control Switch" id="CSWI$oscd$_d8b952184ecefe5c">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Pos" type="Pos$oscd$_66251974e451c6bd"/>
			<DO name="OpCls" type="OpCls$oscd$_8598a343000a4c8c" transient="true"/>
			<DO name="OpOpn" type="OpOpn$oscd$_8598a343000a4c8c" transient="true"/>
		</LNodeType>
		<LNodeType lnClass="CILO" desc="Interlocking" id="CILO$oscd$_aa7ec79ef27309b1">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="EnaCls" type="EnaCls$oscd$_d915d66d9e42a575"/>
			<DO name="EnaOpn" type="EnaOpn$oscd$_d915d66d9e42a575"/>
		</LNodeType>
		<LNodeType lnClass="MMXU" desc="Current Measurement" id="MMXU$oscd$_7c66df888d640e52">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="A" type="A$oscd$_d3d72f8622c6204f"/>
		</LNodeType>
		<LNodeType lnClass="MMXU" desc="Voltage Measurement" id="MMXU$oscd$_476651844f81e32e">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="PhV" type="PhV$oscd$_49de9739e59b5cf3"/>
		</LNodeType>
		<LNodeType lnClass="MMXU" desc="Power Measurement" id="MMXU$oscd$_5dd4c90771cf6cbc">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="TotVA" type="TotVA$oscd$_6416cc1c8c77be03"/>
			<DO name="TotVAr" type="TotVAr$oscd$_6416cc1c8c77be03"/>
			<DO name="TotW" type="TotW$oscd$_6416cc1c8c77be03"/>
		</LNodeType>
		<LNodeType lnClass="LLN0" desc="Logical Node Zero" id="LLN0$oscd$_8b96aca9de4326dc">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_49d4f267d3244ed5"/>
			<DO name="NamPlt" type="NamPlt$oscd$_3af900614f71bde2"/>
		</LNodeType>
		<LNodeType lnClass="LLN0" desc="Logical Node Zero MU" id="LLN0$oscd$_4fd94df3c07db4cd">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_a700dca11da165da"/>
			<DO name="NamPlt" type="NamPlt$oscd$_3af900614f71bde2"/>
		</LNodeType>
		<LNodeType lnClass="PDIS" desc="Distance" id="PDIS$oscd$_0adce19dbd0326c8">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_49d4f267d3244ed5"/>
			<DO name="Op" type="Op$oscd$_8598a343000a4c8c" transient="true"/>
			<DO name="Str" type="Str$oscd$_ba49448ecb46113a"/>
			<DO name="DirMod" type="DirMod$oscd$_586debcdfc6172b8"/>
			<DO name="GndDlTmms" type="GndDlTmms$oscd$_f1c0d370e7430e0c"/>
			<DO name="PhDlTmms" type="PhDlTmms$oscd$_f1c0d370e7430e0c"/>
		</LNodeType>
		<LNodeType lnClass="TCTR" desc="Current Transformer" id="TCTR$oscd$_13d021a7c679a823">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_a700dca11da165da"/>
			<DO name="ARtg" type="ARtg$oscd$_70f83e1c005744f2"/>
			<DO name="HzRtg" type="HzRtg$oscd$_70f83e1c005744f2"/>
			<DO name="AmpSv" type="AmpSv$oscd$_75cba5ebd45ece23"/>
		</LNodeType>
		<LNodeType lnClass="TVTR" desc="Voltage Transformer" id="TVTR$oscd$_c360b0bdfa886120">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_a700dca11da165da"/>
			<DO name="HzRtg" type="HzRtg$oscd$_70f83e1c005744f2"/>
			<DO name="VRtg" type="VRtg$oscd$_70f83e1c005744f2"/>
			<DO name="VolSv" type="VolSv$oscd$_75cba5ebd45ece23"/>
		</LNodeType>
		<LNodeType lnClass="LPHD" desc="Physical Device" id="LPHD$oscd$_6e5b2f6b338c03da">
			<DO name="PhyHealth" type="PhyHealth$oscd$_f60d28fe398302cb"/>
			<DO name="PhyNam" type="PhyNam$oscd$_e15135fb1655f04b"/>
			<DO name="Proxy" type="Proxy$oscd$_d915d66d9e42a575"/>
			<DO name="Sim" type="Sim$oscd$_b4b212f9b038ac3f"/>
			<DO name="PwrUp" type="PwrUp$oscd$_d915d66d9e42a575" transient="true"/>
		</LNodeType>
		<LNodeType lnClass="LPHD" desc="Physical Device SCU" id="LPHD€05451ee3-64c4-4d70-8157-1c1cdf97ce70">
			<DO name="PhyHealth" type="PhyHealth$oscd$_f60d28fe398302cb"/>
			<DO name="PhyNam" type="PhyNam$oscd$_e15135fb1655f04b"/>
			<DO name="Proxy" type="Proxy$oscd$_d915d66d9e42a575"/>
			<DO name="Sim" type="Sim$oscd$_b4b212f9b038ac3f"/>
		</LNodeType>
		<LNodeType lnClass="LTMS" desc="Time Master Supervision" id="LTMS$oscd$_1d817d709be9cda3">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_49d4f267d3244ed5"/>
			<DO name="TmSrc" type="TmSrc$oscd$_51d96cabf8cc341c"/>
			<DO name="TmSrcTyp" type="TmSrcTyp$oscd$_65c569fedba6684c"/>
			<DO name="TmChSt1" type="TmChSt1$oscd$_d915d66d9e42a575"/>
		</LNodeType>
		<LNodeType lnClass="LCCH" desc="Communication Channel Supervision" id="LCCH$oscd$_e84838c16d9bc836">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_49d4f267d3244ed5"/>
			<DO name="ChLiv" type="ChLiv$oscd$_d915d66d9e42a575"/>
			<DO name="RedChLiv" type="RedChLiv$oscd$_d915d66d9e42a575"/>
		</LNodeType>
		<LNodeType lnClass="LSVS" desc="SV Supervision" id="LSVS$oscd$_6553bf2c482cbdab">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="Mod" type="Mod$oscd$_49d4f267d3244ed5"/>
			<DO name="St" type="St$oscd$_d915d66d9e42a575"/>
			<DO name="SvCBRef" type="SvCBRef$oscd$_bcc944f7219fd37e"/>
		</LNodeType>
		<LNodeType lnClass="GGIO" desc="Generic process I/O" id="GGIO$oscd$_ad7a6dea47a79842">
			<DO name="Beh" type="Beh$oscd$_c6ed035c8137b35a"/>
			<DO name="NamPlt" type="NamPlt$oscd$_fcc118145ebdf6d3"/>
			<DO name="Ind1" type="Ind1$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind2" type="Ind2$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind3" type="Ind3$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind4" type="Ind4$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind5" type="Ind5$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind6" type="Ind6$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind7" type="Ind7$oscd$_2bdf395d28c2264a"/>
			<DO name="Ind8" type="Ind8$oscd$_2bdf395d28c2264a"/>
			<DO name="SPCSO1" type="SPCSO1$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO2" type="SPCSO2$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO3" type="SPCSO3$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO4" type="SPCSO4$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO5" type="SPCSO5$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO6" type="SPCSO6$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO7" type="SPCSO7$oscd$_a011ee05c9aa832b"/>
			<DO name="SPCSO8" type="SPCSO8$oscd$_a011ee05c9aa832b"/>
		</LNodeType>
		<DOType cdc="LPL" id="NamPlt$oscd$_3af900614f71bde2">
			<DA name="vendor" fc="DC" bType="VisString255"/>
			<DA name="swRev" fc="DC" bType="VisString255"/>
			<DA name="ldNs" fc="EX" bType="VisString255"/>
			<DA name="configRev" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="St$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ORG" id="SvCBRef$oscd$_bcc944f7219fd37e">
			<DA name="setSrcRef" fc="SP" dchg="true" bType="ObjRef"/>
		</DOType>
		<DOType cdc="LPL" id="NamPlt$oscd$_bd4953f6c36ae1cf">
			<DA name="vendor" fc="DC" bType="VisString255"/>
			<DA name="swRev" fc="DC" bType="VisString255"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind1$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind2$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind3$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind4$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind5$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind6$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind7$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="Ind8$oscd$_2bdf395d28c2264a">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="d" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO1$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO2$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO3$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO4$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO5$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO6$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO7$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="SPCSO8$oscd$_a011ee05c9aa832b">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="opRcvd" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="opOk" fc="OR" dchg="true" bType="BOOLEAN"/>
			<DA name="tOpOk" fc="OR" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="d" fc="DC" bType="VisString255"/>
			<DA name="SBO" fc="CO" bType="VisString129"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="LPL" id="NamPlt$oscd$_fcc118145ebdf6d3">
			<DA name="vendor" fc="DC" bType="VisString255"/>
			<DA name="swRev" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="ACT" id="CBSwitchOff$oscd$_bdbbd544abbc1e96">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="dataNs" fc="EX" bType="VisString255">
				<Val>UNICRON2025</Val>
			</DA>
		</DOType>
		<DOType cdc="SPC" id="Sim$oscd$_b4b212f9b038ac3f">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_d1156f26c8b3fa07"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
		</DOType>
		<DOType cdc="SPS" id="TmChSt1$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENC" id="Mod$oscd$_a700dca11da165da">
			<DA name="stVal" fc="ST" dchg="true" bType="Enum" type="stVal$oscd$_48ba16345b8e7f5b"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_a77afbb487d8bdc0"/>
		</DOType>
		<DOType cdc="ENC" id="Mod$oscd$_49d4f267d3244ed5">
			<DA name="stVal" fc="ST" dchg="true" bType="Enum" type="stVal$oscd$_48ba16345b8e7f5b"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_d1156f26c8b3fa07"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_4974a5c5ec541314"/>
		</DOType>
		<DOType cdc="DPL" id="PhyNam$oscd$_e15135fb1655f04b">
			<DA name="vendor" fc="DC" bType="VisString255"/>
			<DA name="hwRev" fc="DC" bType="VisString255"/>
			<DA name="swRev" fc="DC" bType="VisString255"/>
			<DA name="serNum" fc="DC" bType="VisString255"/>
			<DA name="model" fc="DC" bType="VisString255"/>
		</DOType>
		<DOType cdc="SPS" id="PwrUp$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="MV" id="TotVA$oscd$_6416cc1c8c77be03">
			<DA name="mag" fc="MX" dchg="true" dupd="true" bType="Struct" type="mag$oscd$_ed49c2f7a55ad05a"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="db" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType cdc="MV" id="TotVAr$oscd$_6416cc1c8c77be03">
			<DA name="mag" fc="MX" dchg="true" dupd="true" bType="Struct" type="mag$oscd$_ed49c2f7a55ad05a"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="db" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType cdc="MV" id="TotW$oscd$_6416cc1c8c77be03">
			<DA name="mag" fc="MX" dchg="true" dupd="true" bType="Struct" type="mag$oscd$_ed49c2f7a55ad05a"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="db" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType cdc="ENG" id="DirMod$oscd$_586debcdfc6172b8">
			<DA name="setVal" fc="SE" bType="Enum" type="setVal$oscd$_350f7b4eeea70d37"/>
		</DOType>
		<DOType cdc="ING" id="GndDlTmms$oscd$_f1c0d370e7430e0c">
			<DA name="setVal" fc="SE" bType="INT32"/>
		</DOType>
		<DOType cdc="ING" id="PhDlTmms$oscd$_f1c0d370e7430e0c">
			<DA name="setVal" fc="SE" bType="INT32"/>
		</DOType>
		<DOType cdc="ACT" id="Tr$oscd$_8598a343000a4c8c">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ACD" id="Str$oscd$_ba49448ecb46113a">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="dirGeneral" fc="ST" dchg="true" bType="Enum" type="dirGeneral$oscd$_ba7b8abb9d154a3c"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="DPC" id="Pos$oscd$_66251974e451c6bd">
			<DA name="stVal" fc="ST" dchg="true" bType="Dbpos"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="stSeld" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_f80264355419aeff"/>
			<DA name="sboTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="operTimeout" fc="CF" dchg="true" bType="INT32U"/>
			<DA name="SBOw" fc="CO" bType="Struct" type="SBOw$oscd$_0d1ece84b67fe837"/>
			<DA name="Oper" fc="CO" bType="Struct" type="Oper$oscd$_0d1ece84b67fe837"/>
			<DA name="Cancel" fc="CO" bType="Struct" type="Cancel$oscd$_23b00f788591fc22"/>
		</DOType>
		<DOType cdc="SPC" id="BlkCls$oscd$_2ae8d6d3877c6ea9">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_a77afbb487d8bdc0"/>
		</DOType>
		<DOType cdc="SPC" id="BlkOpn$oscd$_2ae8d6d3877c6ea9">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_a77afbb487d8bdc0"/>
		</DOType>
		<DOType cdc="DPC" id="Pos$oscd$_fb08409822e126d6">
			<DA name="stVal" fc="ST" dchg="true" bType="Dbpos"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
			<DA name="ctlModel" fc="CF" dchg="true" bType="Enum" type="ctlModel$oscd$_a77afbb487d8bdc0"/>
		</DOType>
		<DOType cdc="SPS" id="ChLiv$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPS" id="RedChLiv$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="VSS" id="TmSrc$oscd$_51d96cabf8cc341c">
			<DA name="stVal" fc="ST" dchg="true" bType="VisString255"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENS" id="TmSrcTyp$oscd$_65c569fedba6684c">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_ea90e0679635b15e"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENS" id="PhyHealth$oscd$_f60d28fe398302cb">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_0bcd07051dfc05a4"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPS" id="Proxy$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="CMV" id="phsA$oscd$_65ee65af9248ae5d">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="cVal$oscd$_80272042468595d1"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
		</DOType>
		<DOType cdc="CMV" id="phsB$oscd$_65ee65af9248ae5d">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="cVal$oscd$_80272042468595d1"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
		</DOType>
		<DOType cdc="CMV" id="phsC$oscd$_65ee65af9248ae5d">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="cVal$oscd$_80272042468595d1"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
		</DOType>
		<DOType cdc="WYE" id="PhV$oscd$_49de9739e59b5cf3">
			<SDO name="phsC" type="phsC$oscd$_65ee65af9248ae5d"/>
			<SDO name="phsB" type="phsB$oscd$_65ee65af9248ae5d"/>
			<SDO name="phsA" type="phsA$oscd$_65ee65af9248ae5d"/>
		</DOType>
		<DOType cdc="CMV" id="phsA$oscd$_b0714a86ae3e863a">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="cVal$oscd$_80272042468595d1"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="db" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType cdc="CMV" id="phsB$oscd$_b0714a86ae3e863a">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="cVal$oscd$_80272042468595d1"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="db" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType cdc="CMV" id="phsC$oscd$_b0714a86ae3e863a">
			<DA name="cVal" fc="MX" dchg="true" dupd="true" bType="Struct" type="cVal$oscd$_80272042468595d1"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="t" fc="MX" bType="Timestamp"/>
			<DA name="db" fc="CF" dchg="true" bType="INT32U"/>
		</DOType>
		<DOType cdc="WYE" id="A$oscd$_d3d72f8622c6204f">
			<SDO name="phsC" type="phsC$oscd$_b0714a86ae3e863a"/>
			<SDO name="phsB" type="phsB$oscd$_b0714a86ae3e863a"/>
			<SDO name="phsA" type="phsA$oscd$_b0714a86ae3e863a"/>
		</DOType>
		<DOType cdc="ASG" id="VRtg$oscd$_70f83e1c005744f2">
			<DA name="setMag" fc="SE" bType="Struct" type="setMag$oscd$_ed49c2f7a55ad05a"/>
		</DOType>
		<DOType cdc="SAV" id="VolSv$oscd$_75cba5ebd45ece23">
			<DA name="instMag" fc="MX" bType="Struct" type="instMag$oscd$_5a5af9e249dc7f84"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="sVC" fc="CF" dchg="true" bType="Struct" type="sVC$oscd$_df6488ea078bf55c"/>
		</DOType>
		<DOType cdc="ASG" id="ARtg$oscd$_70f83e1c005744f2">
			<DA name="setMag" fc="SE" bType="Struct" type="setMag$oscd$_ed49c2f7a55ad05a"/>
		</DOType>
		<DOType cdc="ASG" id="HzRtg$oscd$_70f83e1c005744f2">
			<DA name="setMag" fc="SE" bType="Struct" type="setMag$oscd$_ed49c2f7a55ad05a"/>
		</DOType>
		<DOType cdc="SAV" id="AmpSv$oscd$_75cba5ebd45ece23">
			<DA name="instMag" fc="MX" bType="Struct" type="instMag$oscd$_5a5af9e249dc7f84"/>
			<DA name="q" fc="MX" qchg="true" bType="Quality"/>
			<DA name="sVC" fc="CF" dchg="true" bType="Struct" type="sVC$oscd$_df6488ea078bf55c"/>
		</DOType>
		<DOType cdc="ACT" id="Op$oscd$_8598a343000a4c8c">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPS" id="EnaCls$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPS" id="EnaOpn$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ACT" id="OpCls$oscd$_8598a343000a4c8c">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ACT" id="OpOpn$oscd$_8598a343000a4c8c">
			<DA name="general" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENS" id="SwTyp$oscd$_febe33b013272c11">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_5fd8676abc4e2798"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="ENS" id="Beh$oscd$_c6ed035c8137b35a">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="Enum" type="stVal$oscd$_48ba16345b8e7f5b"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="SPS" id="Loc$oscd$_d915d66d9e42a575">
			<DA name="stVal" fc="ST" dchg="true" bType="BOOLEAN"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DOType cdc="INS" id="OpCnt$oscd$_bbaa9369107884bc">
			<DA name="stVal" fc="ST" dchg="true" dupd="true" bType="INT32"/>
			<DA name="q" fc="ST" qchg="true" bType="Quality"/>
			<DA name="t" fc="ST" bType="Timestamp"/>
		</DOType>
		<DAType id="Oper$oscd$_4974a5c5ec541314">
			<BDA name="ctlVal" bType="Enum" type="stVal$oscd$_48ba16345b8e7f5b"/>
			<BDA name="origin" bType="Struct" type="origin$oscd$_cfc683368475eafc"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
		</DAType>
		<DAType id="mag$oscd$_ed49c2f7a55ad05a">
			<BDA name="f" bType="FLOAT32"/>
		</DAType>
		<DAType id="cVal$oscd$_80272042468595d1">
			<BDA name="mag" bType="Struct" type="mag$oscd$_ed49c2f7a55ad05a"/>
		</DAType>
		<DAType id="setMag$oscd$_ed49c2f7a55ad05a">
			<BDA name="f" bType="FLOAT32"/>
		</DAType>
		<DAType id="instMag$oscd$_5a5af9e249dc7f84">
			<BDA name="i" bType="INT32"/>
		</DAType>
		<DAType id="sVC$oscd$_df6488ea078bf55c">
			<BDA name="scaleFactor" bType="FLOAT32"/>
			<BDA name="offset" bType="FLOAT32"/>
		</DAType>
		<DAType id="origin$oscd$_cfc683368475eafc">
			<BDA name="orCat" bType="Enum" type="orCat$oscd$_711cd9acd4dad897"/>
			<BDA name="orIdent" bType="Octet64"/>
		</DAType>
		<DAType id="SBOw$oscd$_0d1ece84b67fe837">
			<BDA name="ctlVal" bType="BOOLEAN"/>
			<BDA name="origin" bType="Struct" type="origin$oscd$_cfc683368475eafc"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
		</DAType>
		<DAType id="Oper$oscd$_0d1ece84b67fe837">
			<BDA name="ctlVal" bType="BOOLEAN"/>
			<BDA name="origin" bType="Struct" type="origin$oscd$_cfc683368475eafc"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
			<BDA name="Check" bType="Check"/>
		</DAType>
		<DAType id="Cancel$oscd$_23b00f788591fc22">
			<BDA name="ctlVal" bType="BOOLEAN"/>
			<BDA name="origin" bType="Struct" type="origin$oscd$_cfc683368475eafc"/>
			<BDA name="ctlNum" bType="INT8U"/>
			<BDA name="T" bType="Timestamp"/>
			<BDA name="Test" bType="BOOLEAN"/>
		</DAType>
		<EnumType id="setVal$oscd$_350f7b4eeea70d37">
			<EnumVal ord="1">NonDirectional</EnumVal>
			<EnumVal ord="2">Forward</EnumVal>
			<EnumVal ord="3">Reverse</EnumVal>
		</EnumType>
		<EnumType id="dirGeneral$oscd$_ba7b8abb9d154a3c">
			<EnumVal ord="0">unknown</EnumVal>
			<EnumVal ord="1">forward</EnumVal>
			<EnumVal ord="2">backward</EnumVal>
			<EnumVal ord="3">both</EnumVal>
		</EnumType>
		<EnumType id="ctlModel$oscd$_a77afbb487d8bdc0">
			<EnumVal ord="0">status-only</EnumVal>
		</EnumType>
		<EnumType id="stVal$oscd$_ea90e0679635b15e">
			<EnumVal ord="1">Unknown</EnumVal>
			<EnumVal ord="2">SNTP</EnumVal>
			<EnumVal ord="3">PTP</EnumVal>
			<EnumVal ord="4">IRIG-B</EnumVal>
			<EnumVal ord="5">Substation internal</EnumVal>
		</EnumType>
		<EnumType id="stVal$oscd$_0bcd07051dfc05a4">
			<EnumVal ord="1">Ok</EnumVal>
			<EnumVal ord="2">Warning</EnumVal>
			<EnumVal ord="3">Alarm</EnumVal>
		</EnumType>
		<EnumType id="ctlModel$oscd$_d1156f26c8b3fa07">
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
		</EnumType>
		<EnumType id="stVal$oscd$_5fd8676abc4e2798">
			<EnumVal ord="2">Disconnector</EnumVal>
		</EnumType>
		<EnumType id="stVal$oscd$_48ba16345b8e7f5b">
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="ctlModel$oscd$_f80264355419aeff">
			<EnumVal ord="0">status-only</EnumVal>
			<EnumVal ord="1">direct-with-normal-security</EnumVal>
			<EnumVal ord="2">sbo-with-normal-security</EnumVal>
			<EnumVal ord="3">direct-with-enhanced-security</EnumVal>
			<EnumVal ord="4">sbo-with-enhanced-security</EnumVal>
		</EnumType>
		<EnumType id="orCat$oscd$_711cd9acd4dad897">
			<EnumVal ord="0">not-supported</EnumVal>
			<EnumVal ord="1">bay-control</EnumVal>
			<EnumVal ord="2">station-control</EnumVal>
			<EnumVal ord="3">remote-control</EnumVal>
			<EnumVal ord="4">automatic-bay</EnumVal>
			<EnumVal ord="5">automatic-station</EnumVal>
			<EnumVal ord="6">automatic-remote</EnumVal>
			<EnumVal ord="7">maintenance</EnumVal>
			<EnumVal ord="8">process</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>