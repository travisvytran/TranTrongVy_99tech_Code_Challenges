import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {ChangeEvent, FocusEvent} from "react";

interface CurrencyInputProps {
    label: string;
    fieldName: string;
    fieldId: string;
    currencyFieldName: string;
    values: any;
    errors: any;
    touched: any;
    tokenCurrenciesList: any[];
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: FocusEvent<HTMLInputElement> ) => void;
    setFieldValue: (field: string, value: any) => void;
    readOnly?: boolean;
}

const CurrencyInput = ({
                           label,
                           fieldName,
                           fieldId,
                           currencyFieldName,
                           values,
                           errors,
                           touched,
                           tokenCurrenciesList,
                           handleChange,
                           handleBlur,
                           setFieldValue,
                           readOnly = false,
                       }: CurrencyInputProps) => {
    const currency = values[currencyFieldName];
    const currencyData = tokenCurrenciesList.find((item) => item.currencyName === currency);

    // Convert the time into pretty format
    const _handleConvertDate = (date: string) => {
        const formatDate = (dateString: string): string => {
            const options: Intl.DateTimeFormatOptions = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                month: "long",
                day: "2-digit",
                year: "numeric",
            };

            return new Date(dateString).toLocaleString("en-GB", options);
        };

        return <>{formatDate(date)}</>;
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Input Label Section */}
            <div className="flex justify-between">
                <Label htmlFor={fieldId}>{label}</Label>
                {currency && currencyData && (
                    <Label className="font-normal text-xs">
                        Last updated: {_handleConvertDate(currencyData.updatedDate)} • Rate:{" "}
                        {currencyData.priceAmount.toFixed(6)}
                    </Label>
                )}
            </div>

            {/* Input and Select Section */}
            <div className="flex gap-2">
                <Input
                    type="number"
                    name={fieldName}
                    id={fieldId}
                    value={values[fieldName]}
                    className={errors[fieldName] && "border-red-500"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={readOnly}
                    required
                    formNoValidate
                />
                <Select
                    name={currencyFieldName}
                    value={currency}
                    onValueChange={(value) => setFieldValue(currencyFieldName, value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Currency"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Available Currencies</SelectLabel>
                            {tokenCurrenciesList.map((currenciesPriceItem, index) => (
                                <SelectItem key={`${fieldName}_${index}`} value={currenciesPriceItem.currencyName}>
                                    <div className="flex gap-2 justify-between items-center w-full">
                                        {currenciesPriceItem.currencyName}
                                        <img
                                            className='w-[24px] h-[24px]'
                                            src={currenciesPriceItem.currencySymbolIcon}
                                            alt={`Icon_${currenciesPriceItem.currencyName}`}
                                        />
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Validation Errors Section */}
            {touched[fieldName] && errors[fieldName] && (
                <div className="form-validation-text">{errors[fieldName]}</div>
            )}
            {touched[currencyFieldName] && errors[currencyFieldName] && (
                <div className="form-validation-text">{errors[currencyFieldName]}</div>
            )}
        </div>
    );
};

export default CurrencyInput;