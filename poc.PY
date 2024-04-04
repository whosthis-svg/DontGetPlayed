import datetime
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

print(" What is your age?")
age = input()
age = int(age)
print("How much per week do you spend on gambling?")
gambling_amount = input()
int(gambling_amount)

print("What channels do you use for gambling(1 for Online, 2 for Offline)?")
channels = input()
channels = int(channels)
print("What is your average weekly income?")
income = input()
income=int(income)

print("When did you start Gambling (mm/yy)?")
start_date = input()


print("Which of these are your hobbies (enter the number with spaces to seperate them)?")
print("1. Sports")
print("2. Gaming")
print("3. Reading")
print("4. Music")
print("5. Adventure")
print("6. Social Media")
print("7. Movies")
print("8. Cooking")
print("9. Traveling")
print("10. Photography")
print("11. Writing")
print("12. Drawing")
print("13. Dancing")
print("14. Painting")
print("15. Gardening")
print("16. Pets")
print("17. Fashion")
print("18. DIY")    
print("19. Other")

hobbies_dict = {
    1: "Sports",
    2: "Gaming",
    3: "Reading",
    4: "Music",
    5: "Adventure",
    6: "Social Media",
    7: "Movies",
    8: "Cooking",
    9: "Traveling",
    10: "Photography",
    11: "Writing",
    12: "Drawing",
    13: "Dancing",
    14: "Painting",
    15: "Gardening",
    16: "Pets",
    17: "Fashion",
    18: "DIY",
    19: "Other"
}

hobbies = input()
hobbies = hobbies.split(" ")
hobbies = [int(hobby) for hobby in hobbies]
hobbies = [hobbies_dict[hobby] for hobby in hobbies]



# Load and clean the dataset
def load_and_clean_data(filepath):
    data = pd.read_excel(filepath)
    cleaned_data = data[['Category', 'Item Name', 'Price', 'Hobby']].dropna()
    return cleaned_data

# Function to map hobbies to items and calculate potential purchases
def calculate_hobby_investment(hobbies, total_gambling_amount, dataset):
    hobby_investments = {}
    for hobby in hobbies:
        # Find items related to the hobby
        hobby_items = dataset[dataset['Hobby'].str.lower() == hobby.lower()]
        if not hobby_items.empty:
            # Calculate how many of each item could be bought
            hobby_investments[hobby] = {
                item['Item Name']: int(total_gambling_amount // item['Price'])
                for _, item in hobby_items.iterrows()
                if item['Price'] <= total_gambling_amount
            }
    return hobby_investments

def project_future_investments(hobbies, weekly_gambling_amount, dataset):
    future_investments = {}
    for hobby in hobbies:
        # Find items related to the hobby
        hobby_items = dataset[dataset['Hobby'].str.lower() == hobby.lower()]
        if not hobby_items.empty:
            # Select a random item that exceeds the weekly gambling amount
            possible_items = hobby_items[hobby_items['Price'] > weekly_gambling_amount]
            if not possible_items.empty:
                selected_item = possible_items.sample(n=1).iloc[0]
                weeks_needed = round(selected_item['Price'] // weekly_gambling_amount)
                future_investments[hobby] = {
                    'Item Name': selected_item['Item Name'],
                    'Weeks Needed': weeks_needed
                }
    return future_investments

def CountTotalWeeksGambling(StartGamblingDate):
    current_date = datetime.datetime.now()
    start_date = datetime.datetime.strptime(StartGamblingDate, "%m/%Y")
    weeks = (current_date - start_date).days // 7
    return weeks

def TotalGamblingAmount(WeeklyGamblingAmount,StartGamblingDate):
    totalWeeks=CountTotalWeeksGambling(StartGamblingDate)
    amount=WeeklyGamblingAmount*totalWeeks
    return amount
def totalIncometilldate(income,StartGamblingDate):
    totalWeeks=CountTotalWeeksGambling(StartGamblingDate)
    totalIncome=income*totalWeeks
    return totalIncome

def PercentageOfIncomeSpentOnGambling(totalIncome,TotalGamblingAmount):
    percentage=(TotalGamblingAmount/totalIncome)*100
    return percentage

def plot_savings_vs_salary(weekly_gambling_amount, weekly_salary):
    weeks = np.arange(1, 53)  # For a year
    cumulative_savings = weeks * weekly_gambling_amount
    cumulative_salary = weeks * weekly_salary

    plt.figure(figsize=(12, 8))

    plt.plot(weeks, cumulative_savings, label='Cumulative Savings from Gambling', marker='o', linestyle='-', markersize=5)
    plt.plot(weeks, cumulative_salary, label='Cumulative Salary', marker='x', linestyle='--', markersize=5)

    plt.xlabel('Weeks')
    plt.ylabel('Amount ($)')
    plt.title('Potential Cumulative Savings vs. Salary Over a Year')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()


    

print("\nYou have spent " + str(round(PercentageOfIncomeSpentOnGambling(totalIncometilldate(int(income),start_date),TotalGamblingAmount(int(gambling_amount),start_date)))) + "% of your income on gambling")
print("\nYou have been gambling for " + str(CountTotalWeeksGambling(start_date)) + " weeks")

# Load the cleaned data
spreadsheet_path = 'price dataset.xlsx'
cleaned_data = load_and_clean_data(spreadsheet_path)
# After collecting user inputs and calculating total spent on gambling
total_gambling_amount = TotalGamblingAmount(int(gambling_amount), start_date)

# Calculate future investments
future_investments = project_future_investments(hobbies, int(gambling_amount), cleaned_data)
hobby_investments = calculate_hobby_investment(hobbies, total_gambling_amount, cleaned_data)



# Output results to the user
print(f"You have currently spent ${total_gambling_amount} on gambling.")
for hobby, items in hobby_investments.items():
    print(f"With that amount, in the hobby of {hobby}, you could have bought:")
    for item, quantity in items.items():
        print(f" - {quantity} x {item}(s)")
# Output future investment projections to the user
print(f"By investing your current weekly gambling expenditure of ${gambling_amount}, you could save up for the following items in your hobbies:")
for hobby, details in future_investments.items():
    print(f"In the hobby of {hobby}, by saving ${gambling_amount} per week, you can afford '{details['Item Name']}' in approximately {details['Weeks Needed']} week(s).")

