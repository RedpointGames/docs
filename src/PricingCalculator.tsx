import * as React from "react";
import Database, { threadAverageCCT, totalGigabitsInMonthEgress } from "./PricingDatabase";

interface PricingCalculatorState {
    location: string;
}

export default class PricingCalculator extends React.Component<{}, PricingCalculatorState> {
    constructor(props) {
        super(props);

        if (globalThis.localStorage !== undefined) {
            this.state = {
                location: globalThis.localStorage.getItem('db-location') ?? 'us-east',
            };
        } else { 
            this.state = {
                location: "us-east",
            }
        }
    }

    public render() {
        let dbLocation: any = null;
        for (const loc of Database) {
            if (loc.id === this.state.location) {
                dbLocation = loc;
                break;
            }
        }
        if (dbLocation === null) {
            dbLocation = Database[0];
        }

        let maxPrice = 0;
        let subregionRatios = {};
        for (const subregion of dbLocation.subregions) {
            let minPricePublic = 0;
            let minPricePrivate = 0;
            for (const provider of subregion.providers) {
                const calc = provider.calculate(threadAverageCCT, totalGigabitsInMonthEgress);
                if (calc.price > maxPrice) {
                    maxPrice = calc.price;
                }
                if (provider.public === true && (minPricePublic === 0 || minPricePublic > calc.price)) {
                    minPricePublic = calc.price;
                }
                if (provider.public !== true && (minPricePrivate === 0 || minPricePrivate > calc.price)) {
                    minPricePrivate = calc.price;
                }
            }
            let ratio = Math.round((minPricePublic / minPricePrivate) * 100) / 100;
            subregionRatios[subregion.name] = (minPricePublic === 0 || minPricePrivate === 0) ? '' : (<><span style={{fontWeight: 'bold'}}>{ratio}x</span> public cloud cost multiplier</>);
        }
        if (maxPrice < 10000)
        {
            // Some regions don't have public cloud at all, but this is a rough benchmark.
            maxPrice = 10000;
        }

        let rows: React.ReactNode[] = [];
        for (const subregion of dbLocation.subregions) {
            rows.push(
                <tr key={this.state.location + "-" + subregion.name}>
                    <th colSpan={3} style={{textAlign: 'left', fontSize: '80%'}}>
                        {subregion.name} <span style={{float: 'right', fontWeight: 'normal'}}>{subregionRatios[subregion.name]}</span>
                    </th>
                </tr>
            );

            let computedRows: { price: number, r: React.ReactNode }[] = [];
            for (const provider of subregion.providers) {
                const calc = provider.calculate(threadAverageCCT, totalGigabitsInMonthEgress);
                const priceRatio = calc.price / maxPrice;
                const greenThreshold = 25;
                const redThreshold = 70;
                const hue = 100 * Math.min(1, Math.max(0, (1 - (Math.max((priceRatio * 100) - greenThreshold, 0) / (redThreshold - greenThreshold)))));
                const colLeft = `hsla(${hue}, 100%, 50%, 0.5)`;
                const colRight = `hsla(${hue}, 100%, 50%, 0)`;
                const anchorLeft = Math.max(0, ((priceRatio * 100) - 0.01)).toString() + '%';
                const anchorRight = Math.min(100, ((priceRatio * 100) + 0.01)).toString() + '%';
                let gradient = `linear-gradient(to right, ${colLeft}, ${colLeft} ${anchorLeft}, ${colRight} ${anchorRight}, ${colRight})`;
                if (priceRatio >= 1) {
                    gradient = `linear-gradient(to right, ${colLeft}, ${colLeft})`;
                }
                const regionDetail = (provider.regionDetail === undefined || provider.regionDetail === '') ? '' : `(${provider.regionDetail})`;
                computedRows.push({
                    price: calc.price,
                    r: (<tr key={this.state.location + "-" + subregion.name + "-" + provider.id + "-" + provider.regionDetail}>
                        <td>
                            <a href={provider.url} target="_blank">{provider.name}</a> {regionDetail}
                        </td>
                        <td style={{ textAlign: 'right', backgroundImage: gradient }}>
                            <span style={{ float: 'left' }}>$</span> {Math.round(calc.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td style={{ fontSize: '80%' }}>
                            {calc.detail}
                        </td>
                    </tr>)
                });
            }
            computedRows.sort((a, b) => -(a.price - b.price));
            for (const computedRow of computedRows) {
                rows.push(computedRow.r);
            }
        }

        let options: React.ReactNode[] = [];
        for (const region of Database) {
            options.push(
                <option key={region.id} value={region.id}>{region.region}</option>
            )
        }


        return (
            <>
                <select className="input margin-bottom--sm" value={this.state.location} onChange={(e) => {
                    this.setState({
                        location: e.currentTarget.value
                    });
                    if (globalThis.localStorage !== undefined) {
                        globalThis.localStorage.setItem('db-location', e.currentTarget.value);
                    }
                }}>
                    {options}
                </select>
                <table style={{width: '100%', display: 'table'}}>
                    <thead>
                        <tr>
                            <th style={{width: '40%'}}>Provider</th>
                            <th style={{width: '25%'}}>Total Cost per Month<br />(Compute + Bandwidth)</th>
                            <th style={{width: '35%'}}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                        </tbody>
                </table>
            </>
        )
    }
}