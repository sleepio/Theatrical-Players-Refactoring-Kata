interface Invoice {
  customer: string;
  performances: Array<PlayPerformance>;
}

interface Play {
  name: string;
  type: string;
}

interface PlayPerformance {
  playID: string;
  audience: number;
}

export function statement(
  invoice: Invoice,
  plays: { [key: string]: Play }
): string {
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function playFor(aPerformance: PlayPerformance): Play {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: PlayPerformance): number {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function volumeCreditsFor(aPerformance: PlayPerformance): number {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function usd(aNumber: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }

  function totalVolumeCredits(): number {
    let result = 0;
    for (let perf of invoice.performances) {
      // add volume credits
      result += volumeCreditsFor(perf);
    } 
    return result;
  }

  function totalAmount(): number {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }
}
