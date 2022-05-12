import * as React from "react";
import Database, { threadAverageCCT, totalGigabitsInMonthEgress } from "./PricingDatabase";

interface BurstCalculatorState {
}

export default class BurstCalculator extends React.Component<{}, BurstCalculatorState> {
    constructor(props) {
        super(props);
    }

    public render() {
        let rows: React.ReactNode[] = [];
        for (const loc of Database) {
            let regionRowCreated = false;
            
            let maxPrice = 0;
            for (const subregion of loc.subregions) {
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
                if (minPricePrivate !== 0 && minPricePublic !== 0) {
                    if (!regionRowCreated) {
                        rows.push(
                            <tr key={loc.id}>
                                <th colSpan={3} style={{ textAlign: 'left', fontSize: '80%' }}>
                                    {loc.region}
                                </th>
                            </tr>
                        );
                        regionRowCreated = true;
                    }

                    const priceRatio = (744 / ratio) / 744;
                    const greenThreshold = 50;
                    const redThreshold = 90;
                    const hue = 100 * Math.min(1, Math.max(0, (1 - (Math.max((priceRatio * 100) - greenThreshold, 0) / (redThreshold - greenThreshold)))));
                    const colLeft = `hsla(${hue}, 100%, 50%, 0.5)`;
                    const colRight = `hsla(${hue}, 100%, 50%, 0)`;
                    const anchorLeft = Math.max(0, ((priceRatio * 100) - 0.01)).toString() + '%';
                    const anchorRight = Math.min(100, ((priceRatio * 100) + 0.01)).toString() + '%';
                    let gradient = `linear-gradient(to right, ${colLeft}, ${colLeft} ${anchorLeft}, ${colRight} ${anchorRight}, ${colRight})`;
                    if (priceRatio >= 1) {
                        gradient = `linear-gradient(to right, ${colLeft}, ${colLeft})`;
                    }

                    rows.push(
                        <tr key={loc.id + "-" + subregion.name}>
                            <td>
                                {subregion.name}
                            </td>
                            <td style={{ textAlign: 'right', backgroundImage: gradient }}>
                                {Math.ceil(30 / ratio)}
                            </td>
                            <td style={{ textAlign: 'right', backgroundImage: gradient }}>
                                {Math.ceil(744 / ratio)}
                            </td>
                        </tr>
                    );
                }
            }
        }

        return (
            <>
                <table style={{width: '100%', display: 'table'}}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }} rowSpan={2}>Region</th>
                            <th style={{width: '25%'}}>Burst Threshold (Days)</th>
                            <th style={{width: '35%'}}>Burst Threshold (Cumulative Hours)</th>
                        </tr>
                        <tr>
                            <th style={{ width: '55%', fontWeight: 'normal' }} colSpan={2}>Lower is better. The lower the value, the cheaper the local provider is compared to the cheapest cloud in that region.</th>
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