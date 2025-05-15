export function Header(
    props: {
        title: string,
        description: string,
    }
) {
    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">{props.title}</h1>
                    <p className="text-gray-400 mt-1">{props.description}</p>
                </div>
            </div>
        </div>
    )
}