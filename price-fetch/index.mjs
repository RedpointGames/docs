import {
  existsSync,
  readFileSync,
  symlink,
  writeFile,
  writeFileSync,
} from "fs";
import fetch from "node-fetch";

const googleCloudApiKey = "";

// Azure pricing API apparently has a bad SSL cert. Not that we care given the information we're trying to pull.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const gcpRegionMap = {
  "europe-west9": {
    name: "France",
    region: "eu-west",
    regionDetail: "Paris",
  },
  "asia-northeast3": {
    name: "South Korea",
    region: "ap-north",
    regionDetail: "Seoul",
  },
  "us-west2": {
    name: "California",
    region: "us-west",
    regionDetail: "Los Angeles",
  },
  "europe-west4": {
    name: "Netherlands",
    region: "eu-west",
  },
  "southamerica-east1": {
    name: "Brazil",
    region: "south-america",
    regionDetail: "São Paulo",
  },
  "us-west4": {
    name: "Nevada",
    region: "us-west",
    regionDetail: "Las Vegas",
  },
  "us-south1": {
    name: "Texas",
    region: "us-central",
    regionDetail: "Dallas",
  },
  "australia-southeast2": {
    name: "Melbourne",
    region: "ap-australia",
  },
  "europe-north1": {
    name: "Finland",
    region: "eu-east",
  },
  "asia-south2": {
    name: "Delhi",
    region: "ap-west",
  },
  "europe-west2": {
    name: "England",
    region: "eu-west",
    regionDetail: "London",
  },
  "us-west3": {
    name: "Utah",
    region: "us-west",
    regionDetail: "Salt Lake City",
  },
  "europe-west8": {
    name: "Italy",
    region: "eu-west",
    regionDetail: "Milan",
  },
  "us-central1": {
    name: "Iowa",
    region: "us-central",
  },
  "asia-southeast2": {
    name: "Indonesia",
    region: "ap-south",
    regionDetail: "Jakarta",
  },
  "us-east5": {
    name: "Ohio",
    region: "us-east",
    regionDetail: "Columbus",
  },
  "europe-west6": {
    name: "Switzerland",
    region: "eu-west",
    regionDetail: "Zürich",
  },
  "australia-southeast1": {
    name: "Sydney",
    region: "ap-australia",
  },
  "asia-east2": {
    name: "Hong Kong",
    region: "ap-central",
  },
  "me-west1": {
    name: "Israel",
    region: "middle-east",
  },
  "us-west1": {
    name: "Oregon",
    region: "us-west",
  },
  "asia-south1": {
    name: "Mumbai & Pune",
    region: "ap-west",
  },
  "europe-central2": {
    name: "Poland",
    region: "eu-east",
  },
  "us-east4": {
    name: "Virginia",
    region: "us-east",
  },
  "northamerica-northeast1": {
    name: "Montréal & Quebec City",
    region: "na-canada",
    city: 'Montréal'
  },
  "asia-southeast1": {
    name: "Singapore",
    region: "ap-south",
  },
  "europe-west3": {
    name: "Germany",
    region: "eu-west",
    regionDetail: "Frankfurt",
  },
  "europe-west1": {
    name: "Belgium",
    region: "eu-west",
  },
  "us-east1": {
    name: "South Carolina",
    region: "us-east",
  },
  "asia-east1": {
    name: "Taiwan",
    region: "ap-north",
  },
  "asia-northeast1": {
    name: "Japan",
    region: "ap-north",
    regionDetail: "Tokyo",
  },
  "southamerica-west1": {
    name: "Chile",
    region: "south-america",
    regionDetail: "Santiago",
  },
  "europe-southwest1": {
    name: "Spain",
    region: "eu-west",
    regionDetail: "Madrid",
  },
  "asia-northeast2": {
    name: "Japan",
    region: "ap-north",
    regionDetail: "Osaka",
  },
  "northamerica-northeast2": {
    name: "Toronto",
    region: "na-canada",
  },
};

const azureNaEuropeGb = 0.08;
const azureAsiaAusMEAGb = 0.11;
const azureSouthAmericaGb = 0.12;
const azureRegionMap = {
  eastus: {
    name: "Virginia",
    region: "us-east",
    pricePerGb: azureNaEuropeGb,
  },
  eastus2: {
    name: "Virginia",
    region: "us-east",
    pricePerGb: azureNaEuropeGb,
    // Redundant.
    unavailable: true,
  },
  westus: {
    name: "California",
    region: "us-west",
    pricePerGb: azureNaEuropeGb,
  },
  westus2: {
    name: "Washington",
    region: "us-west",
    pricePerGb: azureNaEuropeGb,
  },
  centralus: {
    name: "Iowa",
    region: "us-central",
    pricePerGb: azureNaEuropeGb,
  },
  northcentralus: {
    name: "Illinois",
    region: "us-central",
    pricePerGb: azureNaEuropeGb,
  },
  southcentralus: {
    name: "Texas",
    region: "us-central",
    pricePerGb: azureNaEuropeGb,
  },
  westcentralus: {
    name: "Wyoming",
    region: "us-west",
    pricePerGb: azureNaEuropeGb,
  },
  eastasia: {
    name: "Hong Kong",
    region: "ap-central",
    pricePerGb: azureAsiaAusMEAGb,
  },
  southeastasia: {
    name: "Singapore",
    region: "ap-south",
    pricePerGb: azureAsiaAusMEAGb,
  },
  australiacentral: {
    name: "Canberra",
    region: "ap-australia",
    pricePerGb: azureAsiaAusMEAGb,
    // Basically no point to using this region for game servers in Australia. Sydney is better and has cheaper bare metal alternatives.
    unavailable: true,
  },
  australiaeast: {
    name: "Sydney",
    region: "ap-australia",
    pricePerGb: azureAsiaAusMEAGb,
  },
  australiasoutheast: {
    name: "Melbourne",
    region: "ap-australia",
    pricePerGb: azureAsiaAusMEAGb,
  },
  centralindia: {
    name: "Mumbai & Pune",
    region: "ap-west",
    pricePerGb: azureAsiaAusMEAGb,
  },
  southindia: {
    name: "Chennai",
    region: "ap-west",
    pricePerGb: azureAsiaAusMEAGb,
  },
  japaneast: {
    name: "Japan",
    region: "ap-north",
    city: "Tokyo",
    pricePerGb: azureAsiaAusMEAGb,
  },
  japanwest: {
    name: "Japan",
    region: "ap-north",
    city: "Osaka",
    pricePerGb: azureAsiaAusMEAGb,
    // Less expensive than the other region in same area for Azure, but IIRC Osaka has very limited capacity.
    unavailable: true,
  },
  koreacentral: {
    name: "South Korea",
    region: "ap-north",
    city: "Seoul",
    pricePerGb: azureAsiaAusMEAGb,
  },
  northeurope: {
    name: "Ireland",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  canadacentral: {
    name: "Toronto",
    region: "na-canada",
    pricePerGb: azureNaEuropeGb,
  },
  switzerlandwest: {
    name: "Switzerland",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
    // More expensive than the other region in same area for Azure.
    unavailable: true,
  },
  westeurope: {
    name: "Netherlands",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  uksouth: {
    name: "England",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
    // More expensive than the other region in same area for Azure.
    //unavailable: true,
  },
  southafricanorth: {
    name: "Johannesburg",
    region: "africa",
    pricePerGb: azureSouthAmericaGb,
  },
  usgovtexas: {
    unavailable: true,
  },
  swedensouth: {
    unavailable: true,
  },
  usgovvirginia: {
    unavailable: true,
  },
  koreasouth: {
    unavailable: true,
  },
  canadaeast: {
    name: "Montréal & Quebec City",
    city: "Quebec City",
    region: "na-canada",
    pricePerGb: azureNaEuropeGb,
  },
  brazilsouth: {
    name: "Brazil",
    region: "south-america",
    pricePerGb: azureSouthAmericaGb,
  },
  germanynorth: {
    unavailable: true,
  },
  ukwest: {
    name: "England",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  westindia: {
    unavailable: true,
  },
  australiacentral2: {
    unavailable: true,
  },
  norwayeast: {
    name: "Norway",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  jioindiawest: {
    unavailable: true,
  },
  switzerlandnorth: {
    name: "Switzerland",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  francecentral: {
    name: "France",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  southafricawest: {
    unavailable: true,
  },
  germanywestcentral: {
    name: "Germany",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  uaenorth: {
    name: "Dubai",
    region: "middle-east",
    pricePerGb: azureSouthAmericaGb,
  },
  swedencentral: {
    name: "Sweden",
    region: "eu-west",
    pricePerGb: azureNaEuropeGb,
  },
  francesouth: {
    unavailable: true,
  },
  westus3: {
    name: "Arizona",
    region: "us-west",
    pricePerGb: azureNaEuropeGb,
  },
  qatarcentral: {
    unavailable: true,
  },
  usgovarizona: {
    unavailable: true,
  },
  uaecentral: {
    unavailable: true,
  },
  brazilsoutheast: {
    unavailable: true,
  },
  attdallas1: {
    unavailable: true,
  },
  norwaywest: {
    unavailable: true,
  },
  jioindiacentral: {
    unavailable: true,
  },
  attatlanta1: {
    unavailable: true,
  },
};

async function fetchGcp() {
  let nextPageToken = null;
  let skus = [];
  do {
    console.log("fetching page with next token: " + nextPageToken);
    const call = await fetch(
      "https://cloudbilling.googleapis.com/v1/services/6F81-5844-456A/skus?key=" +
        googleCloudApiKey +
        (nextPageToken != null ? "&pageToken=" + nextPageToken : "")
    );
    const response = await call.json();
    nextPageToken = response.nextPageToken;
    for (const sku of response.skus) {
      skus.push(sku);
    }
    console.log("now at " + skus.length + " skus");
  } while (nextPageToken !== "");
  console.log("saving " + skus.length + " to disk");
  writeFileSync("./price-fetch/gcp.json", JSON.stringify(skus, null, 2));
}

async function fetchAzure() {
  let nextPageUrl =
    "https://prices.azure.com/api/retail/prices?$filter=serviceName%20eq%20'Virtual%20Machines'";
  let skus = [];
  do {
    console.log("fetching page with next token: " + nextPageUrl);
    const call = await fetch(nextPageUrl);
    const response = await call.json();
    nextPageUrl = response.NextPageLink;
    for (const sku of response.Items) {
      if (sku.serviceName != "Virtual Machines") {
        throw new Error(`Unexpected SKU service name '${sku.serviceName}'`);
      }
      skus.push(sku);
    }
    console.log("now at " + skus.length + " skus");
  } while (nextPageUrl !== null);
  console.log("saving " + skus.length + " to disk");
  writeFileSync("./price-fetch/azure.json", JSON.stringify(skus, null, 2));
}

async function processGcp() {
  if (!existsSync("./price-fetch/gcp.json")) {
    if (googleCloudApiKey === '') {
      throw new Error("Need to fetch GCP data, but no API key is set!");
    }
    await fetchGcp();
  }

  const skus = JSON.parse(readFileSync("./price-fetch/gcp.json", "utf8"));
  let regions = {};
  for (const sku of skus) {
    if (
      sku.description.startsWith("E2 Instance") ||
      sku.description.startsWith("Network Internet Standard Tier Egress")
    ) {
      for (const region of sku.serviceRegions) {
        if (regions[region] === undefined) {
          regions[region] = {
            core: 0,
            ram: 0,
            pricePerGb: 0,
          };
        }
        if (sku.description.startsWith("E2 Instance Core")) {
          regions[region].core =
            (sku.pricingInfo[0].pricingExpression.tieredRates[0].unitPrice
              .nanos *
              32) /
            1000000000;
        } else if (sku.description.startsWith("E2 Instance Ram")) {
          regions[region].ram =
            (sku.pricingInfo[0].pricingExpression.tieredRates[0].unitPrice
              .nanos *
              32) /
            1000000000;
        } else if (
          sku.description.startsWith("Network Internet Standard Tier Egress")
        ) {
          regions[region].pricePerGb =
            sku.pricingInfo[0].pricingExpression.tieredRates[0].unitPrice
              .nanos / 1000000000;
        }
      }
    }
  }

  let regionMap = [];
  for (const region of Object.keys(regions)) {
    regionMap.push({
      name: gcpRegionMap[region].name,
      region: gcpRegionMap[region].region,
      regionDetail: gcpRegionMap[region].regionDetail,
      pricePerHour:
        Math.round((regions[region].core + regions[region].ram) * 100000) /
        100000,
      vcpu: 32,
      ram: 32,
      pricePerGb: Math.round(regions[region].pricePerGb * 100000) / 100000,
    });
  }
  writeFileSync(
    "./src/data/GoogleCloud.json",
    JSON.stringify(regionMap, null, 2)
  );
}

async function processAzure() {
  if (!existsSync("./price-fetch/azure.json")) {
    await fetchAzure();
  }

  const skus = JSON.parse(readFileSync("./price-fetch/azure.json", "utf8"));
  const priorityList = ["D16as v4", "D16a v4", "F16s v2", "F16"];
  const ramMap = {
    D16asv4: 64,
    D16av4: 64,
    F16sv2: 32,
    F16v1: 32,
  };
  const regionsWithAssignedMachineTypes = {};
  for (const machineType of priorityList) {
    for (const sku of skus) {
      if (
        sku.serviceFamily === "Compute" &&
        sku.type === "Consumption" &&
        sku.skuName === machineType &&
        sku.productName.indexOf("Windows") === -1 &&
        regionsWithAssignedMachineTypes[sku.armRegionName] === undefined
      ) {
        regionsWithAssignedMachineTypes[sku.armRegionName] = {
          machineType: machineType,
          location: sku.location,
          pricePerHour: sku.retailPrice,
        };
      }
    }
  }
  const combinedMap = {};
  for (const detectedRegion of Object.keys(regionsWithAssignedMachineTypes)) {
    if (azureRegionMap[detectedRegion] === undefined) {
      console.warn("missing entry for " + detectedRegion);
    } else if (!azureRegionMap[detectedRegion].unavailable) {
      combinedMap[detectedRegion] = {
        name: azureRegionMap[detectedRegion].name,
        region: azureRegionMap[detectedRegion].region,
        regionDetail: regionsWithAssignedMachineTypes[detectedRegion].location,
        machineType: regionsWithAssignedMachineTypes[
          detectedRegion
        ].machineType.replace(/ /g, ""),
        pricePerHour:
          regionsWithAssignedMachineTypes[detectedRegion].pricePerHour,
        pricePerGb: azureRegionMap[detectedRegion].pricePerGb,
        ram: ramMap[
          regionsWithAssignedMachineTypes[detectedRegion].machineType.replace(
            / /g,
            ""
          )
        ],
        vcpu: 16,
      };
    }
  }
  writeFileSync("./src/data/Azure.json", JSON.stringify(combinedMap, null, 2));
}

async function main() {
  await processAzure();
  await processGcp();
}

main();
