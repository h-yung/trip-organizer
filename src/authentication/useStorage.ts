import { useEffect, useState } from "react";
import { User } from "../utils/interfaces";
import jsesc from "jsesc";

export const useStorage = (
	keyName: string
	// defaultValue: User | string | null //eventually some combo of token or user
) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const value = sessionStorage.getItem(keyName);
			if (value) {
				return JSON.parse(value);
			} else {
				//the default is actually null or empty string
				//meaning I would rather remove the key
				sessionStorage.removeItem(keyName);

				// sessionStorage.setItem(
				// 	keyName,
				// 	JSON.stringify(defaultValue) //restore default value in both storage and state here
				// );
				return null;
			}
		} catch (err) {
			console.log("Something went wrong:", jsesc(err));
			return;
			// return defaultValue; //some error setting stored value; just revert state to default value
		}
	});

	const setValue = (newValue: User | string) => {
		//this layer is needed bc need to stringify the value - not always a string
		if (newValue) {
			try {
				sessionStorage.setItem(keyName, JSON.stringify(newValue));
			} catch (err) {
				console.log(err);
			}
			setStoredValue(newValue);
		} else {
			//if value is empty string or null
			sessionStorage.removeItem(keyName); //clear storage
			setStoredValue(null); //clear state
		}
	};

	return [storedValue, setValue];
};
