// apiMappings.ts
import { dmoMonitorService, providerMonitorService } from '@/services/Client/MonitorService';

interface FunctionMapAnalysis {
    x: string;
    y: string;
}

const functionMapAnalysis = {
  'months_total_offers': dmoMonitorService.getAnalysis
  'days_total_offers': dmoMonitorService.get_total_number_of_offers_by_day,
  'hours_total_offers': dmoMonitorService.get_total_number_of_offers_by_hour,
  'months_new_offers': dmoMonitorService.get_new_offers_by_month,
  'days_new_offers': dmoMonitorService.get_new_offers_by_day,
  'hours_new_offers': dmoMonitorService.get_new_offers_by_hour,
  'months_num_payments': dmoMonitorService.get_num_payments_by_month,
  'days_num_payments': dmoMonitorService.get_num_payments_by_day,
  'hours_num_payments': dmoMonitorService.get_num_payments_by_hour,
  'months_profit': dmoMonitorService.get_profit_by_month,
  'days_profit': dmoMonitorService.get_profit_by_day,
  'hours_profit': dmoMonitorService.get_profit_by_hour,
};

export default functionMapAnalysis;
