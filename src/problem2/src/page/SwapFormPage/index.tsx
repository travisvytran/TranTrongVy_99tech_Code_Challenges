import {FC, useEffect, useState} from "react";
import {Form, Formik} from "formik";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import * as Yup from 'yup';
import "./styles.css"
import {useToast} from "@/hooks/use-toast.ts";
import CurrencyInput from "@/page/SwapFormPage/components/CustomCurrencyInput";
import {BASE_CURRENCIES_PRICES_INFO_API_URL, BASE_IMAGE_API_URL} from "@/constant";

const SwapFormPage: FC = () => {
    const {toast} = useToast()
    const [tokenCurrenciesList, setTokenCurrenciesList] = useState<Array<any>>([]);

    // Fetch function to get list of all token currencies.
    const _handleFetchTokenCurrencies = async () => {
        await fetch(BASE_CURRENCIES_PRICES_INFO_API_URL)
            .then((res) => res.json())
            .then((data) => {

                // New Map of raw currencies data ready for data cleanse.
                const rawCurrenciesData = new Map()

                /*
                Data from server appears to have some names mismatches,
                Since there are only limited, I have created a records of known mismatched ones.
                */
                const missedCurrenciesData: Record<string, string> = {
                    STATOM: "stATOM",
                    STEVMOS: "stEVMOS",
                    RATOM: "rATOM",
                    STOSMO: "stOSMO",
                    STLUNA: "stLUNA"
                };

                // Function to map the mismatched currency name shall there be any or return the existed currency name.
                const getImageUrl = (currencyName: string) => {
                    return missedCurrenciesData[currencyName] || currencyName;
                };

                // Data cleansing using forEach, checking for duplicated currency name. If there is duplicated, get the latest updated date of the currency name.
                data.forEach((currencyItem: any) => {
                    const {currency, date, price} = currencyItem;
                    if (price > 0 && !rawCurrenciesData.has(currency) || new Date(date) > new Date(rawCurrenciesData.get(currency).updatedDate)) {
                        rawCurrenciesData.set(currency, {currency, date, price})
                    }
                })

                // After cleansing, map them into a whole new processed data array and then setState to 'tokenCurrenciesList' state.
                const processedCurrenciesData = Array.from(rawCurrenciesData.values()).map((currencyItem) => ({
                    currencyName: currencyItem.currency,
                    updatedDate: currencyItem.date,
                    priceAmount: currencyItem.price,
                    currencySymbolIcon: `${BASE_IMAGE_API_URL}${getImageUrl(currencyItem.currency)}.svg`
                }))
                setTokenCurrenciesList(processedCurrenciesData);
            })
            .catch((e) =>
                console.error("Failed to fetch token currencies:", e)
            )
    }

    // Form validation schema, using Yup, in which optimized for Formik.
    const formValidationSchema = Yup.object({
        initialAssetCurrency: Yup.string().required("Please add in the initial currency!"),
        swappedAssetCurrency: Yup.string().required("Please add in the desired currency for conversion!"),
        initialAssetValue: Yup.number()
            .required("Please enter your desired amount!")
            .positive("This amount should be higher than 0!"),
    })

    // Conversion function for converting currency
    const _handleSubmitConversion = (values: any, setFieldValue: (field: string, value: any) => void) => {
        const {initialAssetValue, initialAssetCurrency, swappedAssetCurrency} = values;

        // Find prices of the assigned token by .find() in the state of tokenCurrenciesList.
        const fromPrice = tokenCurrenciesList.find((item) => item.currencyName === initialAssetCurrency)
        const toPrice = tokenCurrenciesList.find((item) => item.currencyName === swappedAssetCurrency)

        // If prices are existed, start the conversion process with toast notification.
        if (fromPrice && toPrice) {
            const convertedAmount = (initialAssetValue * fromPrice.priceAmount) / toPrice.priceAmount;
            setFieldValue('swappedAssetValue', convertedAmount.toFixed(6))
            toast({
                variant: 'success',
                title: "Convert Asset Successfully!",
            })
        } else {
            // Should error happen, show failed toast to inform.
            console.error("Unable to calculate conversion. Please check the selected currencies.");
            toast({
                variant: 'destructive',
                title: "Convert asset unsuccessfully.",
            })
        }
    }

    useEffect(() => {
        // Call the fetching function to get the token currencies list.
        (async () => await _handleFetchTokenCurrencies())()
    }, [])

    return (
        // Card UI using ShadCN.
        <Card className='max-w-lg'>
            <CardHeader>
                <CardTitle className='text-blue-900'>Welcome to Currency Swap!</CardTitle>
                <CardDescription>Please fill in your desired amount, initial currency and conversion currency to
                    start!</CardDescription>
            </CardHeader>
            <CardContent>
                {/* This form was made with Formik. */}
                <Formik
                    initialValues={{
                        initialAssetValue: 0,
                        initialAssetCurrency: '',
                        swappedAssetValue: 0,
                        swappedAssetCurrency: ''
                    }}
                    validationSchema={formValidationSchema}
                    onSubmit={(values, formikHelpers) => _handleSubmitConversion(values, formikHelpers.setFieldValue)}>
                    {({values, touched, errors, setFieldValue, handleBlur, handleChange}) => (
                        <Form id='swap-currency-form' className='flex flex-col gap-4'>
                            {/* Make form input into component for clean code. */}
                            <CurrencyInput
                                label="From"
                                fieldName="initialAssetValue"
                                fieldId="initialAssetValueField"
                                currencyFieldName="initialAssetCurrency"
                                values={values}
                                errors={errors}
                                touched={touched}
                                tokenCurrenciesList={tokenCurrenciesList}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                setFieldValue={setFieldValue}
                            />
                            {/* Make form input into component for clean code. */}
                            <CurrencyInput
                                label="To"
                                fieldName="swappedAssetValue"
                                fieldId="swappedAssetValueField"
                                currencyFieldName="swappedAssetCurrency"
                                values={values}
                                errors={errors}
                                touched={touched}
                                tokenCurrenciesList={tokenCurrenciesList}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                setFieldValue={setFieldValue}
                                readOnly
                            />
                            <Button className='bg-blue-950 mt-2' size='lg' type="submit"
                                    disabled={values.initialAssetValue === 0 || !values.initialAssetValue || !values.initialAssetCurrency || !values.swappedAssetCurrency}>
                                Convert
                            </Button>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
}

export default SwapFormPage;