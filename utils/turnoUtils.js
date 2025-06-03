export const normalizeTurno = (turno) =>
  turno.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const turnos = {
  manha: { start_time: "08:00", end_time: "12:00" },
  tarde: { start_time: "13:00", end_time: "17:00" },
  integral: { start_time: "08:00", end_time: "17:00" },
};

export const haConflitoDeTurno = (turnoNovo, turnoExistente) => {
  const turnosEquivalentes = {
    manha: ["manha", "integral"],
    tarde: ["tarde", "integral"],
    integral: ["manha", "tarde", "integral"],
  };

  const novo = normalizeTurno(turnoNovo);
  const existente = normalizeTurno(turnoExistente);

  return turnosEquivalentes[novo]?.includes(existente);
};
