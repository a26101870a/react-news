import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Published() {

    //2 === 已發布
    const { dataSource, handleSunset } = usePublish(2)

    return (
        <div>
            <NewsPublish
                dataSource={dataSource}
                button={(id) =>
                    <Button
                        danger
                        onClick={() => handleSunset(id)}
                    >
                        下線
                    </Button>
                }
            />
        </div>
    )
}
