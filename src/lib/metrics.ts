import { ConfigDefault } from "./config-default";

export class Metrics {
    private instant_counts: any = {};
    private instant_values: any = {};
    private last_window_values: any = {};

    constructor() {
        // Process window every X minutes
        setInterval(() => {
            this.process_window();
        }, 5000);
    }

    increment(metric_name: string) {
        this.add(metric_name, 1);
    }
    
    add(metric_name: string, value: number) {
        // Create metric if not exists
        if (!this.instant_counts[metric_name]) {
            this.instant_counts[metric_name] = 1;
            this.instant_values[metric_name] = value;
        }
        
        // Else increment values
        else {
            this.instant_counts[metric_name] += 1;
            this.instant_values[metric_name] += value;
        }
    }

    getData() {
        return this.last_window_values;
    }

    private process_window() {
        this.last_window_values = {};

        for (const metric of Object.keys(this.instant_counts)) {
            // Get values
            this.last_window_values[metric] = {
                count: this.instant_counts[metric],
                sum: this.instant_values[metric],
                avg: this.instant_counts[metric] ? Math.round(this.instant_values[metric] / this.instant_counts[metric]) : 0
            };

            // Reset instant values
            this.instant_counts[metric] = 0;
            this.instant_values[metric] = 0;
        }
    }
}