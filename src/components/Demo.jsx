import {useState, useEffect } from 'react';
import {copy, linkIcon, loader, tick} from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';


const demo = () => {
  // useState takes an object as the initial state and returns an array with two values: a current state and a function to update the current state
  const [article, setArticle] = useState({
    url:'',
    summary:'',
  })

  const [copied, setCopied] = useState("");

  const [allArticles, setAllArticles] = useState([])

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  useEffect(()=>{
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));
    if (articlesFromLocalStorage){
      setAllArticles(articlesFromLocalStorage);
    }
  }, [])

  // we use async/await to handle API call
  const handleSubmit = async (e)=>{
    e.preventDefault(); //prevent the default behavior
    const { data } = await getSummary({ articleUrl : article.url});
    if (data?.summary){
      const newArticle = {...article, summary: data.summary}
      const updatedAllArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(allArticles);
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout( ()=> setCopied(false), 3000);
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
      <div className="flex flex-col w-full gap-2">
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt="link_icon" className='absolute left-0 my-2 ml-3 w-5'/>
        
          <input type="url" 
          placeholder="enter a url of the article you would like to summarize!"
          //article here is a state in the form of a dictionary with two keys: url and summary
          value={article.url}
          required 
          onChange={(e)=>setArticle({
            ...article, url: e.target.value
          })} 
          className='url_input peer'/> 
          {/* we want to change the button depending on the state of our input */}
          <button type="submit"
          className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'>
            OK
          </button>
        </form>

        {/* Browse url history */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
         {allArticles.map((item, index)=>(
          <div key = {`link-${index}`} 
          onClick={()=> setArticle(item)} 
          className='link_card'>
              <div className='copy_btn' onClick={()=> handleCopy(item.url)}>
                <img 
                src ={copied === item.url? tick: copy} 
                alt='copy_icon' 
                className='w-[40%] h-[40%] object-contain'/>
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
          </div>
         ))}
        </div>
      </div>

      {/* Display results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        { isFetching ? (
        <img src={loader} alt="loader" className='w-20 h-20 object-contain'/>
        ): error ? (
          
          <p className='font-inter font-bold text-black text-center'> 
          Well, that was not supposed to happen
          <br/>
          <span className='font-satoshi font-normal text-gray-700'>
            {error?.data?.error}
          </span>
          </p>

        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'> 
                Article <span className='blue_gradient'>
                  Summary
                </span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>{article.summary}</p>
              </div>
            </div>
          )
        )}
      </div>

    </section>
  )
}

export default demo