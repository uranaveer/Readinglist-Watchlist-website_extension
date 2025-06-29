import torch
from llm import tokenizer,model

title ="""
Ana de Armas - Wikipedia
"""
description = """
Ana Celia de Armas Caso (Spanish pronunciation: [ˈana ˈselja ðe ˈaɾmas ˈkaso]; born 30 April 1988)[2] is a Cuban and Spanish actress. She began her career in Cuba with a leading role in the romantic drama Una rosa de Francia (2006). At the age of 18, she moved to Madrid, Spain, and starred in the popular drama El Internado (2007–2010). After moving to Los Angeles, de Armas had English-speaking roles in the psychological thriller Knock Knock (2015) and the comedy-crime film War Dogs (2016).
De Armas rose to prominence for her roles as the holographic AI Joi in the science fiction film Blade Runner 2049 (2017) and nurse Marta Cabrera in the mystery film Knives Out (2019), receiving a nomination for the Golden Globe Award for Best Actress – Motion Picture Comedy or Musical. She then played Bond girl Paloma in the James Bond film No Time to Die (2021) and actress Marilyn Monroe in the biographical drama Blonde (2022), for which she became the first Cuban nominated for the Academy Award for Best Actress.
De Armas was born in Havana, Cuba,[2] and raised in Santa Cruz del Norte.[3] Her maternal grandparents were Spanish immigrants to Cuba from the regions of Guardo, León, and Valverde de la Sierra [es], Palencia, both in the north of Spain.[4][5][6] Her father Ramón de Armas had various jobs, including bank manager, teacher, school principal and deputy mayor of a town.[7] He previously studied philosophy at a Soviet University.[7][8] Her mother Ana Caso worked in the human resources section of the Ministry of Education.[9][10][11] De Armas has one older brother, Francisco Javier de Armas Caso, a US–based photographer[7][12] who, in 2020, was questioned by Cuban police due to his critical stance on Decree 349 and his links to artists under government surveillance.[13] While de Armas grew up with food rationing, fuel shortages and electricity blackouts during Cuba's Special Period,[7][14] she has described her early life as happy.[9]
During her childhood and adolescence, de Armas had no Internet access and had limited knowledge of popular culture beyond Cuba.[15][16] She was allowed to watch "20 minutes of cartoons on Saturday and the Sunday movie matinee."[17] Her family did not own a video or DVD player, and she watched Hollywood movies in her neighbor's apartment.[18] She memorized and practiced monologues in front of a mirror,[19][20] and decided to become an actress when she was 12.[21] In 2002, aged 14, she successfully auditioned to join Havana's National Theatre of Cuba.[9][22] She sometimes hitchhiked to attend the "rigorous" course.[23][24] While a student, she filmed three movies.[7][10] She left the four-year drama course shortly before presenting her final thesis because Cuban graduates are forbidden from leaving the country without first completing three years of mandatory service to the community.[10][25] At age 18, with Spanish citizenship through her maternal grandparents,[4][14] she moved to Madrid to pursue an acting career.[10]
In her native Cuba, de Armas had a starring role opposite Álex González in Manuel Gutiérrez Aragón's romantic drama Una rosa de Francia (2006).[14] Cuban actor Jorge Perugorría suggested that the director consider de Armas for the role, after meeting her while attending a birthday party with his daughters.[26][27] The director visited de Armas's drama school and interrupted the sixteen-year-old during her audition to inform her that the role was hers.[26][28] She travelled to Spain as part of a promotional tour for the film and was introduced to Juan Lanja, who would later become her Spanish agent.[26] She then starred in the movie El edén perdido (2007) and had a supporting role in Fernando Pérez's Madrigal (2007), filmed at night without the permission of her drama school tutors.[10]
At age 18, de Armas moved to Madrid. Within two weeks of arriving, she met with casting director Luis San Narciso, who had seen her in Una rosa de Francia.[15] Two months later,[29] he cast her as Carolina in the drama El Internado,[10] in which she starred for six seasons from 2007 to 2010. The television show, set in a boarding school, became popular with viewers and made de Armas a celebrity figure in Spain.[10] In a break from filming, she starred in the successful coming-of-age comedy Mentiras y Gordas (2009).[30] Despite the popularity of El Internado, de Armas felt typecast and was mainly offered roles as youngsters.[15] She asked to be written out of the show in its second to last season.[31]
After spending a few months living in New York City to learn English,[25] de Armas was persuaded to return to Spain to star in seventeen episodes of the historical drama Hispania (2010–2011).[3] She then starred in Antonio Trashorras's horror films El callejón (2011) and Anabel (2015),[32] and in the drama Por un puñado de besos (2014).[33] During a long period without acting work,[23] de Armas participated in workshops at Tomaz Pandur's Madrid theatre company[7] and felt "very anxious" about
"""
prompt = f"""
You are an expert assistant. Given a webpage title and description, do two things:

1. Decide if the content is high quality and worth showing on a user dashboard.
2. Provide a short, useful summary for the user.

Rate the content using:
- Clarity [0–5]
- Usefulness [0–5]
- Trustworthiness [0–5]
- Engagement [0–5]

If the average score is 4+, rate as High. If 2–3.9, Medium. Otherwise, Low.


Respond in this format:
Quality: [High/Medium/Low] — [Short reason]
Summary: [One or two sentence summary]


New Input:
Title: "{title}"
Description:"{description}"
Response:
"""



inputs = tokenizer(prompt, return_tensors="pt")

# Generate output (limit tokens for speed)
with torch.no_grad():
    outputs = model.generate(
        inputs["input_ids"],
        max_new_tokens=100,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
        eos_token_id=tokenizer.eos_token_id,
    )
result = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(result[len(prompt):].strip())

inputs1 = tokenizer(prompt, return_tensors="pt")

# Generate output (limit tokens for speed)
with torch.no_grad():
    outputs = model.generate(
        inputs1["input_ids"],
        max_new_tokens=100,
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
        eos_token_id=tokenizer.eos_token_id,
    )
result1 = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(result1[len(prompt):].strip())