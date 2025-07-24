import { useTranslation } from "react-i18next"

export default function Wrapper() {
  const { t } = useTranslation();

  return (
    <div className='z-40 bg-gray-300 w-full min-h-screen'>
      <div className='min-h-screen flex justify-center items-center bg-gray-300 p-4'>
        <div className='flex flex-col justify-center items-center text-center px-4 sm:px-6'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4'>{t("Welcome to the Visualization Tool")}</h1>
          <p className='text-base sm:text-lg'>{t("Please sign in to continue")}</p>
        </div>
      </div>
    </div>
  )
}
