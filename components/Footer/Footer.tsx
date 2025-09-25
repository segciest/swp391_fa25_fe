import 'flowbite';
export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <strong className="block text-center text-xl font-bold text-gray-900 sm:text-3xl">
                        LIÊN HỆ CHÚNG TÔI ĐỂ CÓ NHỮNG ƯU ĐÃI MỚI NHẤT
                    </strong>

                    <form className="mt-6">
                        <div className="relative max-w-lg">
                            <label className="sr-only" htmlFor="email"> Email </label>

                            <input
                                className="w-full rounded-full border-gray-200 bg-gray-100 p-4 pe-32 text-sm font-medium"
                                id="email"
                                type="email"
                                placeholder="abc@gmail.com"
                            />

                            <button
                                className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                            >
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>




            </div>
        </footer>
    )
}