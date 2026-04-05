// Parameter Data extracted from parametersDetails.txt
const PARAMETERS_DATA = [
    {
        name: "PlanCycle",
        label: "Plan Cycle",
        values: [
            "MTP 2045", "TIP 2020", "STIP 2020", "LRTP 2045", "STIP - MG - DEST",
            "TIP 2020 - 2032", "AZ TEST - 2022", "TIP 2022-L", "00-STIP", "10-STIP",
            "TIP 2022", "test Hist", "Archive", "LR", "TIP 2020 Mapped", "STIP 2030",
            "REQ2020", "ES-STIP-2025", "Visualize 2045", "A0005", "Hola My Test",
            "2022-TVN-6981", "AA -TIP 2018", "TVN-6981", "2023 NFTPO", "Liber Tower",
            "AA0004", "111-STIP-111", "AA0001", "2024", "Concord Plan Cycle",
            "TIP 2029", "2323", "03-STIP-30", "Test2022", "STIP 2029", " TIP 2024",
            "FMIS 2020", "ESTIP2024", "MG-STIP", "CC202412.1", "C-Tower", "TIP 2023",
            "TIP 2021", "ACTIVETHIS", "TVN-7271", "JJ202412.1", "MG2023", "CFP STBG",
            "JC202412.1", "A0001", "TESTSEBA2025", "MG0000", "TIP 2025", "TESTSEBA"
        ],
        multiValue: true
    },
    {
        name: "PlanRevision",
        label: "Plan Revision",
        values: [
            "SPI PLAN REVISION", "MG - attachments - test", "Admin Mod #2", "230525-Test-EcoDOT",
            "ggggfdg", "stip 01", "Testing Placeholders 1", "AZ TESTING", "TESTALEX",
            "MWCOG2", "Mod 00", "Parking Lot", "P10STIP Short Name", "06/20/2026",
            "Testing Demo12", "Adoption", "Formal Amend #1", "230523-InterMPO", "20-01 REQ",
            "Test 09252023.2", "MarioTest", "Admin Mod #1", "MOD #33", "Source #1",
            "Source 1", "ADOPT STIP 2030", "TIP-REQ-ADOPT-2", "STIP Amend #4", "Plan Rev 1",
            "001", "RevToDelete", "2022-TVN-6981-03", "TIP-REQ-ADOPT-1", "Test Adoption",
            "20-14", "JC20240124.1", "CVMPO TIP / 21 000A", "MG - attachments - test 2",
            "TVN-6981-1", "Test 09252023.1", "EEE 222", "NFTPO #2", "hola123", "Test1",
            "Formal Amend #2", "TVN-5795-DEST1", "Liber Tower", "TVN-5795-DEST2"
        ],
        multiValue: true
    },
    {
        name: "PlanRevisionType",
        label: "Plan Revision Type",
        values: ["Adoption", "Administrative Modification", "Formal Amendment", "Admin Mod", "Formal Amend"],
        multiValue: true
    },
    {
        name: "ReviewStatus",
        label: "Review Status",
        values: ["Draft", "Pending", "Accepted", "Denied"],
        multiValue: true
    },
    {
        name: "County",
        label: "County",
        values: [
            "El Dorado", "Placer", "Sutter", "Sacramento", "Yolo", "Yuba",
            "Sacramento, Placer, Sutter", "El Dorado, Placer", "Placer, Sacramento",
            "El Dorado, Placer, Sacramento", "Sacramento, Yolo", "Sutter, Placer",
            "Yolo, Yuba", "Placer, Sutter, Sacramento", "El Dorado, Sutter"
        ],
        multiValue: true
    },
    {
        name: "Municipality",
        label: "Municipality",
        values: [
            "Antelope", "Baltimore Washington Region", "Carmichael", "Citrus Heights",
            "City of Alexandria", "City of Fairfax", "City of Falls Church", "City of Frederick",
            "City of Manassas", "City of Manassas Park", "City of Rockville", "Clarksburg",
            "Courtland", "Davis", "District of Columbia", "El Macero", "Elk Grove",
            "Elverta", "Fair Oaks", "Hood", "Mather", "North Highlands", "Orangevale",
            "Rancho Cordova", "Region-wide", "Rio Linda", "Roseville", "West Sacramento",
            "Wilton", "Statewide MD", "Statewide VA", "Suburban MD", "Suburban VA"
        ],
        multiValue: true
    },
    {
        name: "FundType",
        label: "Fund Type",
        values: [
            "STBG", "CMAQ", "NHPP", "SRTS", "SPR", "RAISE",
            "Section 5310", "Section 5311", "Section 5339", "Transit Enhancement",
            "State Funds", "Local Funds", "Federal Funds"
        ],
        multiValue: true
    },
    {
        name: "FiscalYear",
        label: "Fiscal Year",
        values: [
            "2020", "2021", "2022", "2023", "2024", "2025",
            "2026", "2027", "2028", "2029", "2030", "2045", "2047"
        ],
        multiValue: true
    }
];

// Report Configurations (Dynamic paths for each report)
const REPORTS = [
    {
        id: 0,
        name: "Project List Report",
        path: "/Ecointeractive_POC/Project List Report"
    },
    {
        id: 1,
        name: "Project Overview Report",
        path: "/Ecointeractive_POC/Project_Overview_Report"
    },
    {
        id: 2,
        name: "Location Details Report",
        path: "/Ecointeractive_POC/Location_Details_Report"
    },
    {
        id: 3,
        name: "Funding Details Report",
        path: "/Ecointeractive_POC/Funding_Detail_Report"
    }
];
