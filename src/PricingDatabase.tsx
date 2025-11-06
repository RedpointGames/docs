import * as React from "react";
import gcp from "./data/GoogleCloud.json";
import azure from "./data/Azure.json";

const playerKilobitsPerSecondEgress = 400;
const playerAverageCCU = 1500;
const playersPerMatch = 8;
const serverAverageCCS = playerAverageCCU / playersPerMatch;
const threadsPerServer = 1.5;
export const threadAverageCCT = serverAverageCCS * threadsPerServer;
const totalKilobitsInMonthEgress =
  playerKilobitsPerSecondEgress * 60 * 60 * 24 * 30;
export const totalGigabitsInMonthEgress = totalKilobitsInMonthEgress / 1e6;

const Database = [
  {
    id: "us-east",
    region: "Americas → U.S. East Coast",
    subregions: [
      {
        name: "Virginia",
        providers: [
          {
            id: "datapacket",
            name: "Datapacket",
            url: "https://www.datapacket.com/pricing",
            regionDetail: "Ashburn",
            public: false,
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 660,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} 2 x Intel Silver 4210 servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "phoenixnap",
            name: "phoenixNAP",
            url: "https://phoenixnap.com/servers/dedicated",
            regionDetail: "Ashburn",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 295,
              };
              const includedTb = 15;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual Silver 4210R" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          }
        ],
      },
      {
        name: "Ohio",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.088,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "sectorlink",
            name: "SectorLink",
            url: "https://www.sectorlink.com/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 48, // two socket, 12C/24T
                ram: 64,
                pricePerMonth: 265 + 96 + 17,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Dual E5-2690V2" servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "South Carolina",
        providers: [],
      },
    ],
  },
  {
    id: "us-central",
    region: "Americas → U.S. Central",
    subregions: [
      {
        name: "Iowa",
        providers: [
          {
            id: "webpundits",
            name: "Webpundits",
            url: "https://webpundits.in/dedicated-server-in-iowa-usa/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 128,
                pricePerMonth: 175,
              };
              const includedTb = 20;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "2 x Intel Xeon E2670v1" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Illinois",
        providers: [
          {
            id: "datapacket",
            name: "Datapacket",
            url: "https://www.datapacket.com/pricing",
            regionDetail: "Chicago",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 660,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} 2 x Intel Silver 4210 servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "phoenixnap",
            name: "phoenixNAP",
            url: "https://phoenixnap.com/servers/dedicated",
            regionDetail: "Chicago",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 295,
              };
              const includedTb = 15;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual Silver 4210R" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "cloudfitters",
            name: "Cloudfitters",
            url: "https://cloudfitters.com/chicago-dedicated-servers/",
            regionDetail: "Chicago",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 24,
                pricePerMonth: 250,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Dual E5-2690V2" servers
                    <br />
                    Unmetered 10Gbps bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Texas",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, Dallas",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c5d2xlarge = {
                vcpu: 8,
                ram: 16,
                pricePerHour: 0.48,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c5d2xlarge.vcpu);
              return {
                price:
                  c5d2xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c5d.2xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "clouvider",
            name: "Clouvider",
            url: "https://www.clouvider.com/dedicated-servers/dallas/",
            regionDetail: "Dallas",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 427.5,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Dual Silver 4210R" servers
                    <br />
                    10Gbps up to 100TB
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "us-west",
    region: "Americas → U.S. West Coast",
    subregions: [
      {
        name: "California",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, North California",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.3568,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "datapacket",
            name: "Datapacket",
            url: "https://www.datapacket.com/pricing",
            regionDetail: "Los Angeles",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 660,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} 2 x Intel Silver 4210 servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "dedipath",
            name: "DediPath",
            url: "https://dedipath.com/las-vegas-dedicated-servers",
            regionDetail: "Los Angeles",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 24, // two socket, 6C/12T
                ram: 64,
                pricePerMonth: 199 + 40,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Intel Dual E5-2620v2" servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Washington",
        providers: [
          {
            id: "gthost",
            name: "GTHost",
            url: "https://gthost.com/seattle-dedicated-servers/",
            regionDetail: "Seattle",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 128,
                pricePerMonth: 139,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Xeon 2xE5-2650v2" servers
                    <br />
                    500Mbit/s unmetered bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Nevada",
        providers: [
          {
            id: "hosthink-us-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Las Vegas",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} US-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "dedipath",
            name: "DediPath",
            url: "https://dedipath.com/las-vegas-dedicated-servers",
            regionDetail: "Las Vegas",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 24, // two socket, 6C/12T
                ram: 32,
                pricePerMonth: 139 + 40,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Intel Dual E5-2620v2" servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Utah",
        providers: [],
      },
      {
        name: "Oregon",
        providers: [
          {
            id: "forked",
            name: "Fork Networking",
            url: "https://www.forked.net/dedicated/",
            regionDetail: "Portland",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 24, // two socket, 6C/12T
                ram: 64,
                pricePerMonth: 339,
              };
              const includedTb = 500;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "2x Intel Xeon E5 2430L" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Wyoming",
        providers: [],
      },
      {
        name: "Arizona",
        providers: [
          {
            id: "phoenixnap",
            name: "phoenixNAP",
            url: "https://phoenixnap.com/servers/dedicated",
            regionDetail: "Phoenix",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 295,
              };
              const includedTb = 15;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual Silver 4210R" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "cloudfitters",
            name: "Cloudfitters",
            url: "https://cloudfitters.com/chicago-dedicated-servers/",
            regionDetail: "Phoenix",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 64,
                pricePerMonth: 237,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2xE5-2630V3-16" servers
                    <br />
                    Unmetered 10Gbps bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "na-canada",
    region: "Americas → Canada",
    subregions: [
      {
        name: "Montréal & Quebec City",
        providers: [
          {
            id: "hosthink-ca-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} CA-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "servermania",
            name: "ServerMania",
            url: "https://www.servermania.com/dedicated-servers-toronto.htm",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 48, // two socket, 12C/24T
                ram: 64,
                pricePerMonth: 189,
              };
              const includedTb = 20;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual Intel Xeon E5-2695v2" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Toronto",
        providers: [
          {
            id: "datapacket",
            name: "Datapacket",
            url: "https://www.datapacket.com/pricing",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 690,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} 2 x Intel Silver 4210 servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "gthost",
            name: "GTHost",
            url: "https://gthost.com/toronto-dedicated-servers/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 256,
                pricePerMonth: 139,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Xeon 2xE5-2650v2" servers
                    <br />
                    500Mbit/s unmetered bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Vancouver",
        providers: [
          {
            id: "gthost",
            name: "GTHost",
            url: "https://gthost.com/vancouver-dedicated-servers/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 256,
                pricePerMonth: 139,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Xeon 2xE5-2650v2" servers
                    <br />
                    500Mbit/s unmetered bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "south-america",
    region: "Americas → South America",
    subregions: [
      {
        name: "Brazil",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, São Paulo",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.6768,
              };
              const egressCostPerGb = 0.15;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hosthink-br-4",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 899.9,
              };
              const includedTb = 20;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} BR-4 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hostdime",
            name: "HostDime",
            url: "https://core.hostdime.com/purchaseserver/index",
            regionDetail: "São Paulo",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 399,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x 8-Core Xeon E5-2630" servers
                    <br />1 Gbits bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hostdime",
            name: "HostDime",
            url: "https://core.hostdime.com/purchaseserver/index",
            regionDetail: "João Pessoa",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 349,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x 8-Core Xeon E5-2630" servers
                    <br />1 Gbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Mexico",
        providers: [
          {
            id: "hostdime",
            name: "HostDime",
            url: "https://core.hostdime.com/purchaseserver/index",
            regionDetail: "Guadalajara",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 399,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x 8-Core Xeon E5-2630" servers
                    <br />1 Gbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Colombia",
        providers: [
          {
            id: "hostdime",
            name: "HostDime",
            url: "https://core.hostdime.com/purchaseserver/index",
            regionDetail: "Bogota",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 399,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x 8-Core Xeon E5-2630" servers
                    <br />1 Gbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Chile",
        providers: [
          {
            id: "hosthink-cl-2",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 16, // one socket, 8C/16T
                ram: 64,
                pricePerMonth: 374.9,
              };
              const includedTb = 20;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} CL-2 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "eu-west",
    region: "Europe → Western Europe",
    subregions: [
      {
        name: "France",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, Paris",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.296,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hosthink-fr-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Paris",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} FR-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "ovhcloud",
            name: "OVHcloud",
            url: "https://us.ovhcloud.com/bare-metal/advance/adv-4/",
            regionDetail: "Gravelines",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // one socket, 16C/32T
                ram: 64,
                pricePerMonth: 226 + 16.6666 /* setup fee */,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} Advance-4 servers
                    <br />
                    Unmetered 1Gbit/s bandwidth per server
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Belgium",
        providers: [
          {
            id: "1gbits",
            name: "1gbits",
            url: "https://1gbits.com/buy-dedicated-server/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 8, // one socket, 4C/8T
                ram: 8,
                pricePerMonth: 86,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "DS Intel Xeon E3 1230 V2" servers
                    <br />
                    Max 10TB per server
                  </>
                ),
              };
            },
          },
          {
            id: "estnoc",
            name: "Estnoc",
            url: "https://www.estnoc.ee/dedicated-servers/belgium.html",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 56, // two socket, 14C/28T
                ram: 96,
                pricePerMonth: 241.89,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "E5 Enterprise Server G9 BE" servers
                    <br />
                    10TB included
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Sweden",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, Stockholm",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.168,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "swedendedicated",
            name: "Sweden Dedicated",
            url: "https://swedendedicated.com/dedicated-servers/",
            regionDetail: "Stockholm",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 128,
                pricePerMonth: 176.69,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} R620 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Ireland",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.1674,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hosthink-ie-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Dublin",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} IE-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Italy",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, Milan",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.2928,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hosthink-it-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Milan",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} IT-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "England",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, London",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.2928,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "ovhcloud",
            name: "OVHcloud",
            url: "https://us.ovhcloud.com/bare-metal/advance/adv-4/",
            regionDetail: "London",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // one socket, 16C/32T
                ram: 64,
                pricePerMonth: 226 + 16.6666 /* setup fee */,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} Advance-4 servers
                    <br />
                    Unmetered 1Gbit/s bandwidth per server
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Germany",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, Frankfurt",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.2416,
              };
              const egressCostPerGb = 0.09;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "gthost",
            name: "GTHost",
            url: "https://gthost.com/frankfurt-dedicated-servers/",
            regionDetail: "Frankfurt",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 24, // one socket, 12C/24T
                ram: 64,
                pricePerMonth: 159,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} Supermicro 6027TR servers
                    <br />
                    Unmetered 1Gbit/s bandwidth per server
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Netherlands",
        providers: [
          {
            id: "hosthink-nl-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Amsterdam",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} NL-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "phoenixnap",
            name: "phoenixNAP",
            url: "https://phoenixnap.com/dedicated-servers-amsterdam-netherlands",
            regionDetail: "Amsterdam",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 12, // one socket, 6C/12T
                ram: 64,
                pricePerMonth: 105,
              };
              const includedTb = 15;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} E-2276G servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Switzerland",
        providers: [
          {
            id: "datapacket",
            name: "Datapacket",
            url: "https://www.datapacket.com/pricing",
            regionDetail: "Zürich",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 550,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} 2 x Intel Silver 4210 servers
                    <br />
                    Unmetered 1Gbps bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hosthink-ch-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Zürich",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 479.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} CH-9 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "swissmade",
            name: "Swissmade",
            url: "https://swissmade.host/en/dedicated-servers-switzerland",
            regionDetail: "Zürich",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 48, // two socket, 12C/24T
                ram: 48,
                pricePerMonth: 398.6,
              };
              const includedTb = 15;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} Beta G servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Spain",
        providers: [
          {
            id: "dedimax",
            name: "Dedimax",
            url: "https://www.dedimax.com/en/dedicated-server",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 12, // one socket, 6C/12T
                ram: 16,
                pricePerMonth: 122.65,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Intel Xeon E-2276G" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Norway",
        providers: [
          {
            id: "dedimax",
            name: "Dedimax",
            url: "https://www.dedimax.com/en/dedicated-server-Oslo",
            regionDetail: "Oslo",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 360.75,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Intel Dual Silver 4210" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "eu-east",
    region: "Europe → Eastern Europe",
    subregions: [
      {
        name: "Poland",
        providers: [
          {
            id: "ovhcloud",
            name: "OVHcloud",
            url: "https://us.ovhcloud.com/bare-metal/advance/adv-4/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // one socket, 16C/32T
                ram: 64,
                pricePerMonth: 226 + 16.6666 /* setup fee */,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} Advance-4 servers
                    <br />
                    Unmetered 1Gbit/s bandwidth per server
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Finland",
        providers: [
          {
            id: "creanova",
            name: "Creanova",
            url: "https://billing.creanova.org/index.php?rp=/store/dedicated-servers",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 226.93,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x CPU Xeon Ten-Core E5-2680 v2" servers
                    <br />
                    15TB bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Serbia",
        providers: [
          {
            id: "phoenixnap",
            name: "phoenixNAP",
            url: "https://phoenixnap.com/servers/dedicated",
            regionDetail: "Belgrade",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 24, // two socket, 6C/12T
                ram: 64,
                pricePerMonth: 149,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02; // TBC
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} E5-2620 v3 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "ap-north",
    region: "Asia → Northern Asia",
    subregions: [
      {
        name: "Japan",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift, Tokyo",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.3696,
              };
              const egressCostPerGb = 0.114;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "hosthink-jp-9",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            regionDetail: "Tokyo",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 64,
                pricePerMonth: 579.9,
              };
              const includedTb = 5;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} JP-4 servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "South Korea",
        providers: [],
      },
      {
        name: "Taiwan",
        providers: [
          {
            id: "dataplugs",
            name: "Dataplugs",
            url: "https://www.dataplugs.com/en/taiwan-dedicated-server-hosting/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 445,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} JP-4 servers
                    <br />
                    100Mbits unmetered bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "ap-central",
    region: "Asia → Central Asia",
    subregions: [
      {
        name: "Hong Kong",
        providers: [
          {
            id: "hostdime",
            name: "HostDime",
            url: "https://core.hostdime.com/purchaseserver/index",
            regionDetail: "Chai Wan",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 399,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x 8-Core Xeon E5-2630" servers
                    <br />1 Gbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "ap-south",
    region: "Asia → Southern Asia",
    subregions: [
      {
        name: "Indonesia",
        providers: [
          {
            id: "klikserver",
            name: "Klikserver",
            url: "https://www.klikserver.com/dedicated-server/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 401.88,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "Dual E5-2620 v4" servers
                    <br />
                    1Gbit unmetered bandwidth (local to Indonesia only)
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Singapore",
        providers: [
          {
            id: "ovhcloud",
            name: "OVHcloud",
            url: "https://www.ovhcloud.com/en-au/bare-metal/enterprise/mg-256/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 40, // two socket, 10C/20T
                ram: 256,
                pricePerMonth: 310,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} MG-256 servers
                    <br />
                    500Mbit 10TB bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "ap-west",
    region: "Asia → India",
    subregions: [
      {
        name: "Delhi",
        providers: [
          {
            id: "hostdime",
            name: "HostDime",
            url: "https://core.hostdime.com/purchaseserver/index",
            regionDetail: "New Delhi",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 399,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2 x 8-Core Xeon E5-2630" servers
                    <br />1 Gbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Mumbai & Pune",
        providers: [
          {
            id: "milesweb",
            name: "MilesWeb",
            url: "https://www.milesweb.in/hosting/dedicated-servers/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, 8C/16T
                ram: 32,
                pricePerMonth: 200.9,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} "2x E5-2680 2.70GHz" servers
                    <br />
                    1Gbps 5TB bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Chennai",
        providers: [],
      },
    ],
  },
  {
    id: "ap-australia",
    region: "Australia",
    subregions: [
      {
        name: "Sydney",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.4208,
              };
              const egressCostPerGb = 0.114;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "servers-australia",
            name: "Servers Australia",
            url: "https://www.serversaustralia.com.au/products/dedicated-servers/",
            calculate: function (threads, egressGb) {
              const duale5 = {
                hyperthreads: 32,
                ram: 128,
                pricePerMonth: 460.44,
              };
              const includedTb = 7;
              const excessEgressCostPerGb = 0.02;
              const instances = Math.ceil(threads / duale5.hyperthreads);
              return {
                price:
                  duale5.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Enterprise 16" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "intergrid",
            name: "Intergrid",
            url: "https://intergrid.com.au/",
            calculate: function (threads, egressGb) {
              const duale5 = {
                hyperthreads: 64, // two socket, each socket 16C/32T
                ram: 256,
                pricePerMonth: 327.77,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.03;
              const instances = Math.ceil(threads / duale5.hyperthreads);
              return {
                price:
                  duale5.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "2X Xeon-4216 v1" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Melbourne",
        providers: [
          {
            id: "intergrid",
            name: "Intergrid",
            url: "https://intergrid.com.au/",
            calculate: function (threads, egressGb) {
              const duale5 = {
                hyperthreads: 40, // two socket, each socket 10C/20T
                ram: 32,
                pricePerMonth: 273.11,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.03;
              const instances = Math.ceil(threads / duale5.hyperthreads);
              return {
                price:
                  duale5.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual E5-2650 v3" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Edge - Remaining Regions",
        providers: [
          {
            id: "intergrid-per",
            name: "Intergrid",
            url: "https://intergrid.com.au/",
            regionDetail: "Perth",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 56, // two socket, each socket 14C/28T
                ram: 128,
                pricePerMonth: 366.86,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.03;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual E5-2680 v4" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
          {
            id: "intergrid-adl",
            name: "Intergrid",
            url: "https://intergrid.com.au/",
            regionDetail: "Adelaide",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 32, // two socket, each socket 8C/16T
                ram: 64,
                pricePerMonth: 226.36,
              };
              const includedTb = 10;
              const excessEgressCostPerGb = 0.03;
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price:
                  server.pricePerMonth * instances +
                  Math.max(0, egressGb * 2 - includedTb * 1000) *
                    excessEgressCostPerGb,
                detail: (
                  <>
                    {instances} "Dual E5-2670" servers
                    <br />
                    {Math.max(0, egressGb * 2 - includedTb * 1000)} GB billed
                    bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "africa",
    region: "Africa",
    subregions: [
      {
        name: "Cape Town",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c5a8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.648,
              };
              const egressCostPerGb = 0.154;
              const instances = Math.ceil(vcpus / c5a8xlarge.vcpu);
              return {
                price:
                  c5a8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c5a.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Johannesburg",
        providers: [
          {
            id: "hosthink-za-3",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 12, // one socket, 6C/12T
                ram: 64,
                pricePerMonth: 279.9,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} ZA-3 servers
                    <br />
                    6TB 100Mbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
      {
        name: "Cairo",
        providers: [
          {
            id: "hosthink-eg-5",
            name: "Hosthink",
            url: "https://www.hosthink.net/",
            calculate: function (threads, egressGb) {
              const server = {
                hyperthreads: 24, // one socket, 6C/12T
                ram: 32,
                pricePerMonth: 249.9,
              };
              const instances = Math.ceil(threads / server.hyperthreads);
              return {
                price: server.pricePerMonth * instances,
                detail: (
                  <>
                    {instances} EG-5 servers
                    <br />
                    10TB 100Mbits bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
  {
    id: "middle-east",
    region: "Middle East",
    subregions: [
      {
        name: "Israel",
        providers: [],
      },
      {
        name: "Dubai",
        providers: [],
      },
      {
        name: "Bahrain",
        providers: [
          {
            id: "aws",
            name: "Amazon Web Services",
            url: "https://aws.amazon.com/",
            regionDetail: "GameLift",
            public: true,
            calculate: function (vcpus, egressGb) {
              const c6g8xlarge = {
                vcpu: 32,
                ram: 64,
                pricePerHour: 1.36,
              };
              const egressCostPerGb = 0.117;
              const instances = Math.ceil(vcpus / c6g8xlarge.vcpu);
              return {
                price:
                  c6g8xlarge.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} c6g.8xlarge servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          },
        ],
      },
    ],
  },
];

for (const region of gcp) {
  let found = false;
  for (const db of Database) {
    if (db.id == region.region) {
      for (const subregion of db.subregions) {
        if (subregion.name == region.name) {
          found = true;
          subregion.providers.push({
            id: "gcp",
            name: "Google Cloud",
            url: "https://cloud.google.com/",
            regionDetail: region.regionDetail ?? "",
            public: true,
            calculate: function (vcpus, egressGb) {
              const server = {
                vcpu: region.vcpu,
                ram: region.ram,
                pricePerHour: region.pricePerHour,
              };
              const egressCostPerGb = region.pricePerGb;
              const instances = Math.ceil(vcpus / server.vcpu);
              return {
                price:
                  server.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} e2-highcpu-32 servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          });
        }
      }
      if (found) {
        break;
      }
    }
  }
  if (!found) {
    throw new Error(
      "Missing " +
        region.region +
        "/" +
        region.name +
        " from Database, so can't add GCP entry!"
    );
  }
}
for (const key of Object.keys(azure)) {
  const region = azure[key];
  let found = false;
  for (const db of Database) {
    if (db.id == region.region) {
      for (const subregion of db.subregions) {
        if (subregion.name == region.name) {
          found = true;
          subregion.providers.push({
            id: "azure",
            name: "Azure",
            url: "https://azure.microsoft.com/",
            regionDetail: "PlayFab, " + region.regionDetail,
            public: true,
            calculate: function (vcpus, egressGb) {
              const egressCostPerGb = region.pricePerGb;
              const instances = Math.ceil(vcpus / region.vcpu);
              return {
                price:
                  region.pricePerHour * instances * 730 +
                  egressCostPerGb * egressGb,
                detail: (
                  <>
                    {instances} {region.machineType} servers
                    <br />
                    {egressGb} GB billed bandwidth
                  </>
                ),
              };
            },
          });
        }
      }
      if (found) {
        break;
      }
    }
  }
  if (!found) {
    throw new Error(
      "Missing " +
        region.region +
        "/" +
        region.name +
        " from Database, so can't add Azure entry!"
    );
  }
}

export default Database;
