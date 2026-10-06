# Analyse scores
library(dplyr)

scores <- data.frame(name = c("Godette", "Bob"), score = c(9001L, 42L))

summarise_scores <- function(df, min_score = 0) {
  df %>%
    filter(score > min_score) %>%
    summarise(best = max(score), n = n())
}

if (nrow(scores) > 0 && !is.null(scores$name)) {
  print(summarise_scores(scores, 10), TRUE, NA, Inf)
}
