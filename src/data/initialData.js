export const APPROVAL_STAGES = [
  { key: 'requestDate',           label: 'Request' },
  { key: 'flightSupportApproval', label: 'Flight Support' },
  { key: 'preparationDate',       label: 'Preparation' },
  { key: 'engSafetySignoff',      label: 'Eng / Safety' },
  { key: 'finalApproval',         label: 'Final Approval' },
  { key: 'fopCompletion',         label: 'FOP Complete' },
]

export const STATUS_OPTIONS = ['Assessment Completed', 'ENG', 'Safety', 'CATB', 'In Progress']
export const OPS_TYPE_OPTIONS = ['ETOPS Alternate', 'Destination Alternate', 'Destination Airfield']
export const SLOT_OPTIONS = [
  { value: '1', label: '1 – Not Required' },
  { value: '2', label: '2 – Coordination Required' },
  { value: '3', label: '3 – Slots Required' },
]
export const RFF_OPTIONS = ['5', '6', '7', '8', '9', '10']
export const ILS_OPTIONS = ['None', 'Cat 1', 'Cat 2', 'Cat 3']
export const LIGHTING_OPTIONS = ['None', 'P1 CAT 1', 'P2 CAT 2/3']
export const RA_STATUS_OPTIONS = ['Pending', 'In Review', 'Completed', 'N/A']

function blankGen(overrides = {}) {
  return {
    name: '', iata: '', icao: '', country: '',
    operationsType: 'Destination Airfield',
    status: 'In Progress',
    elevation: '', msa25nm: '', maxObstacleHeight: '',
    operatingHours: 'H24',
    maxRunwayDesignation: '', pcn: '', ilsApproaches: '',
    vor: false, rnav: false, rnp: false, gnss: false, loc: false, ndb: false,
    slotRequirements: '1',
    requestDate: '', flightSupportApproval: '', preparationDate: '',
    engSafetySignoff: '', finalApproval: '', fopCompletion: '',
    assessmentAge: '', version: 1,
    ...overrides,
  }
}

function blankRunway(overrides = {}) {
  return {
    id: Date.now(),
    designator: '', length: '', width: '',
    approachLighting: 'None',
    ilsCat1: false, ilsCat2: false, ilsCat3: false,
    vor: false, rnav: false, rnp: false, circling: false,
    gnss: false, loc: false, ndb: false,
    ...overrides,
  }
}

function blankRestrictions(overrides = {}) {
  return {
    simultaneousRunwayOps: false,
    wildlifeHazard: '',
    atsGroundMovement: false,
    rffCategory: '9',
    b757fmc: '', b767fmc: '', b777ffmc: '',
    lidoIpad: false, paperBackup: false,
    tawsB757: false, tawsB767: false, tawsB777F: false,
    raasB757: false, raasB767: false, raasB777F: false,
    runwayRestrictions: '', taxiwayRestrictions: '',
    apronRestrictions: '', fleetLimitations: '',
    ...overrides,
  }
}

function blankGop(overrides = {}) {
  return {
    dhlStationPresence: false, supervisionRequirements: '',
    loadDocs: false, catering: false, disinsection: false,
    fuelAvailability: false, deiceAvailability: false,
    crewTransit: false, countryReporting: '',
    securityAssessment: '', dangerousGoods: false,
    ...overrides,
  }
}

function blankSafe(overrides = {}) {
  return {
    safetyComments: '', raStatus: 'Pending',
    uncontrolledAttitude: '', supportingDocuments: '',
    ...overrides,
  }
}

function blankEng(overrides = {}) {
  return {
    engineeringContact: '', engineeringComments: '',
    supportProvider: '', spannerAvailability: false,
    ...overrides,
  }
}

export const INITIAL_AIRFIELDS = [
  {
    id: 'CYEG',
    gen: blankGen({
      name: 'Edmonton International', iata: 'YEG', icao: 'CYEG', country: 'Canada',
      operationsType: 'ETOPS Alternate', status: 'Assessment Completed',
      elevation: 2373, msa25nm: 5800, maxObstacleHeight: 3200,
      operatingHours: 'H24', maxRunwayDesignation: '30', pcn: '62/F/C/X/T',
      ilsApproaches: 'CAT I/II/III',
      vor: true, rnav: true, rnp: true, gnss: true, loc: true, ndb: true,
      slotRequirements: '1',
      requestDate: '2024-01-15', flightSupportApproval: '2024-01-20',
      preparationDate: '2024-02-01', engSafetySignoff: '2024-02-15',
      finalApproval: '2024-03-01', fopCompletion: '2024-03-15',
      assessmentAge: 0.1, version: 2,
    }),
    fopRunways: [blankRunway({
      id: 1, designator: '30/12', length: 11000, width: 200,
      approachLighting: 'P2 CAT 2/3',
      ilsCat1: true, ilsCat2: true, ilsCat3: true,
      vor: true, rnav: true, rnp: true, gnss: true, loc: true,
    })],
    fopRestrictions: blankRestrictions({
      simultaneousRunwayOps: false, wildlifeHazard: 'Low – seasonal bird strikes',
      atsGroundMovement: true, rffCategory: '9',
      b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed',
      lidoIpad: true, paperBackup: true,
      tawsB757: true, tawsB767: true, tawsB777F: true,
      raasB757: true, raasB767: true, raasB777F: true,
      runwayRestrictions: 'None', taxiwayRestrictions: 'None',
      apronRestrictions: 'None', fleetLimitations: 'None',
    }),
    gop: blankGop({
      dhlStationPresence: true, supervisionRequirements: 'DHL station staff on site',
      loadDocs: true, catering: true, disinsection: false,
      fuelAvailability: true, deiceAvailability: true,
      crewTransit: true, countryReporting: 'Standard reporting required',
      securityAssessment: 'Standard airport security – adequate',
      dangerousGoods: true,
    }),
    safe: blankSafe({
      safetyComments: 'This airfield assessment is sufficient for DHL cargo operations.',
      raStatus: 'Completed',
    }),
    eng: blankEng({
      engineeringContact: 'DHL Engineering Support', engineeringComments: 'All engineering requirements met.',
      supportProvider: 'DHL Internal', spannerAvailability: true,
    }),
  },
  {
    id: 'KGTF',
    gen: blankGen({
      name: 'Great Falls International', iata: 'GTF', icao: 'KGTF', country: 'USA',
      operationsType: 'ETOPS Alternate', status: 'ENG',
      elevation: 3680, msa25nm: 9000, maxObstacleHeight: 5500,
      operatingHours: 'H24', maxRunwayDesignation: '21', pcn: '45/F/B/X/T',
      ilsApproaches: 'CAT I',
      vor: true, rnav: true, rnp: true, gnss: true, loc: true, ndb: false,
      slotRequirements: '1', requestDate: '2024-03-01', version: 2,
    }),
    fopRunways: [blankRunway({ id: 2, designator: '21/03', length: 10500, width: 150, approachLighting: 'P1 CAT 1', ilsCat1: true, vor: true, rnav: true, gnss: true, loc: true })],
    fopRestrictions: blankRestrictions({ rffCategory: '7', b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed', lidoIpad: true, paperBackup: true }),
    gop: blankGop({ fuelAvailability: true, deiceAvailability: true }),
    safe: blankSafe({ raStatus: 'In Review' }),
    eng: blankEng({ engineeringContact: 'TBD' }),
  },
  {
    id: 'KBIL',
    gen: blankGen({
      name: 'Billings Logan International', iata: 'BIL', icao: 'KBIL', country: 'USA',
      operationsType: 'ETOPS Alternate', status: 'ENG',
      elevation: 3652, msa25nm: 9500, maxObstacleHeight: 6000,
      operatingHours: 'H24', maxRunwayDesignation: '28', pcn: '40/F/B/X/T',
      ilsApproaches: 'CAT I',
      vor: true, rnav: true, rnp: false, gnss: true, loc: true, ndb: false,
      slotRequirements: '1', requestDate: '2024-03-01', version: 2,
    }),
    fopRunways: [blankRunway({ id: 3, designator: '28/10', length: 10528, width: 150, approachLighting: 'P1 CAT 1', ilsCat1: true, vor: true, rnav: true, gnss: true, loc: true })],
    fopRestrictions: blankRestrictions({ rffCategory: '7', b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed', lidoIpad: true, paperBackup: true }),
    gop: blankGop({ fuelAvailability: true, deiceAvailability: true }),
    safe: blankSafe({ raStatus: 'In Review' }),
    eng: blankEng({ engineeringContact: 'TBD' }),
  },
  {
    id: 'CYOD',
    gen: blankGen({
      name: 'Cold Lake', iata: 'YOD', icao: 'CYOD', country: 'Canada',
      operationsType: 'ETOPS Alternate', status: 'ENG',
      elevation: 1775, msa25nm: 4500, maxObstacleHeight: 2800,
      operatingHours: 'H24', maxRunwayDesignation: '31', pcn: '55/F/C/X/T',
      ilsApproaches: 'CAT I',
      vor: true, rnav: true, rnp: false, gnss: true, loc: true, ndb: true,
      slotRequirements: '2', requestDate: '2024-03-01', version: 2,
    }),
    fopRunways: [blankRunway({ id: 4, designator: '31/13', length: 10000, width: 200, approachLighting: 'P1 CAT 1', ilsCat1: true, vor: true, rnav: true, gnss: true, loc: true, ndb: true })],
    fopRestrictions: blankRestrictions({ rffCategory: '8', wildlifeHazard: 'Military airfield – wildlife control active', b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed', lidoIpad: true, paperBackup: true }),
    gop: blankGop({ fuelAvailability: true, deiceAvailability: true, countryReporting: 'Military clearance required' }),
    safe: blankSafe({ raStatus: 'In Review' }),
    eng: blankEng({ engineeringContact: 'TBD' }),
  },
  {
    id: 'LRBS',
    gen: blankGen({
      name: 'Bucharest Băneasa', iata: 'BBU', icao: 'LRBS', country: 'Romania',
      operationsType: 'Destination Alternate', status: 'ENG',
      elevation: 295, msa25nm: 3500, maxObstacleHeight: 1200,
      operatingHours: 'H24', maxRunwayDesignation: '07', pcn: '35/F/B/X/T',
      ilsApproaches: 'CAT I',
      vor: true, rnav: true, rnp: false, gnss: true, loc: true, ndb: true,
      slotRequirements: '3', requestDate: '2024-03-10', version: 2,
    }),
    fopRunways: [blankRunway({ id: 5, designator: '07/25', length: 6562, width: 148, approachLighting: 'P1 CAT 1', ilsCat1: true, vor: true, rnav: true, gnss: true, loc: true, ndb: true })],
    fopRestrictions: blankRestrictions({ rffCategory: '6', b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'N/A', lidoIpad: true, paperBackup: true, fleetLimitations: 'B777F not suitable – runway length restriction' }),
    gop: blankGop({ fuelAvailability: true, deiceAvailability: false, countryReporting: 'EU entry reporting required', dangerousGoods: false }),
    safe: blankSafe({ raStatus: 'In Review' }),
    eng: blankEng({ engineeringContact: 'TBD' }),
  },
  {
    id: 'EDDB',
    gen: blankGen({
      name: 'Berlin Brandenburg', iata: 'BER', icao: 'EDDB', country: 'Germany',
      operationsType: 'Destination Alternate', status: 'Safety',
      elevation: 157, msa25nm: 3200, maxObstacleHeight: 980,
      operatingHours: 'H24', maxRunwayDesignation: '25L', pcn: '70/F/C/X/T',
      ilsApproaches: 'CAT I/II/III',
      vor: true, rnav: true, rnp: true, gnss: true, loc: true, ndb: false,
      slotRequirements: '3', requestDate: '2024-03-15', version: 2,
    }),
    fopRunways: [
      blankRunway({ id: 6, designator: '25L/07R', length: 13123, width: 197, approachLighting: 'P2 CAT 2/3', ilsCat1: true, ilsCat2: true, ilsCat3: true, vor: true, rnav: true, rnp: true, gnss: true, loc: true }),
      blankRunway({ id: 7, designator: '25R/07L', length: 11811, width: 148, approachLighting: 'P1 CAT 1', ilsCat1: true, vor: true, rnav: true, gnss: true, loc: true }),
    ],
    fopRestrictions: blankRestrictions({
      simultaneousRunwayOps: true, rffCategory: '10',
      wildlifeHazard: 'Low', atsGroundMovement: true,
      b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed',
      lidoIpad: true, paperBackup: true,
      tawsB757: true, tawsB767: true, tawsB777F: true,
      raasB757: true, raasB767: true, raasB777F: true,
      taxiwayRestrictions: 'DO NOT use TXL L for gates 78-88',
    }),
    gop: blankGop({ dhlStationPresence: true, fuelAvailability: true, deiceAvailability: true, dangerousGoods: true, countryReporting: 'EU entry reporting required' }),
    safe: blankSafe({ safetyComments: 'Safety review in progress.', raStatus: 'In Review' }),
    eng: blankEng({ engineeringContact: 'DHL Germany Engineering', spannerAvailability: true }),
  },
  {
    id: 'EBLG',
    gen: blankGen({
      name: 'Liege Airport', iata: 'LGG', icao: 'EBLG', country: 'Belgium',
      operationsType: 'Destination Airfield', status: 'Safety',
      elevation: 659, msa25nm: 3800, maxObstacleHeight: 2100,
      operatingHours: 'H24', maxRunwayDesignation: '23L', pcn: '68/F/C/X/T',
      ilsApproaches: 'CAT I/II/III',
      vor: true, rnav: true, rnp: true, gnss: true, loc: true, ndb: false,
      slotRequirements: '2', requestDate: '2024-03-20', version: 2,
    }),
    fopRunways: [blankRunway({ id: 8, designator: '23L/05R', length: 11483, width: 197, approachLighting: 'P2 CAT 2/3', ilsCat1: true, ilsCat2: true, ilsCat3: true, vor: true, rnav: true, rnp: true, gnss: true, loc: true })],
    fopRestrictions: blankRestrictions({
      rffCategory: '10', wildlifeHazard: 'Moderate – active bird control programme',
      atsGroundMovement: true,
      b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed',
      lidoIpad: true, paperBackup: true,
      tawsB757: true, tawsB767: true, tawsB777F: true,
      raasB757: true, raasB767: true, raasB777F: true,
    }),
    gop: blankGop({ dhlStationPresence: true, fuelAvailability: true, deiceAvailability: true, dangerousGoods: true, loadDocs: true, catering: true }),
    safe: blankSafe({ safetyComments: 'DHL hub – safety review ongoing.', raStatus: 'In Review' }),
    eng: blankEng({ engineeringContact: 'DHL Belgium Engineering', spannerAvailability: true }),
  },
  {
    id: 'LTAF',
    gen: blankGen({
      name: 'Adana Şakirpaşa', iata: 'ADA', icao: 'LTAF', country: 'Turkey',
      operationsType: 'Destination Alternate', status: 'ENG',
      elevation: 65, msa25nm: 3500, maxObstacleHeight: 1800,
      operatingHours: 'H24', maxRunwayDesignation: '05', pcn: '50/F/B/X/T',
      ilsApproaches: 'CAT I',
      vor: true, rnav: true, rnp: false, gnss: true, loc: true, ndb: true,
      slotRequirements: '2', requestDate: '2024-04-01', version: 2,
    }),
    fopRunways: [blankRunway({ id: 9, designator: '05/23', length: 9514, width: 148, approachLighting: 'P1 CAT 1', ilsCat1: true, vor: true, rnav: true, gnss: true, loc: true, ndb: true })],
    fopRestrictions: blankRestrictions({ rffCategory: '8', b757fmc: 'FMC installed', b767fmc: 'FMC installed', b777ffmc: 'FMC installed', lidoIpad: true, paperBackup: true }),
    gop: blankGop({ fuelAvailability: true, deiceAvailability: false, countryReporting: 'Turkish aviation authority reporting required' }),
    safe: blankSafe({ raStatus: 'Pending' }),
    eng: blankEng({ engineeringContact: 'TBD' }),
  },
]

export { blankGen, blankRunway, blankRestrictions, blankGop, blankSafe, blankEng }
