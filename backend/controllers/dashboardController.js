// -----------------------------------------------------------------------------------
//                              Import  Statements
// -----------------------------------------------------------------------------------

import { getDashboardStatsData } from "../services/analyticsServices";

// -----------------------------------------------------------------------------------
//                              Controller  Statements
// -----------------------------------------------------------------------------------

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await getDashboardStatsData();
    const { _meta, ...payload } = data;
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
