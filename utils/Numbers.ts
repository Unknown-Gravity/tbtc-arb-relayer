import { escape } from "querystring";

/**
 * @name formatNumber
 * @description Format a number to have two digits
 * @param {number} number
 * @returns {string} formatted number
 */
export const formatNumber = (number: number): string => {
	return number.toString().padStart(2, "0");
};
